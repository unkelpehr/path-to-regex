(function () {
	var root = this,

		reDoubleSlashes = /\/+/g,
		reFindDirs = /\/?[^\/]+?(?=\/|$)/g,
		reTestForCapture = /(^|\/)+\:+?/,
		reEscapeRe = /[-\/\\^$*+?.()|[\]{}]/g,
		reFindAllWildcards = /\*/g,
		reFindAsteriskNotFollowedBySlash = /\*(?!$)/g;

	/**
	 * Extracts the static portion of a path; i.e. everything up until a modifier.
	 * /*                     = /
	 * /get/some/:stuff?/     = /get/some
	 * /get/some/*            = /get/some
	 * /get/some/stu*         = /get/some
	 * /get/some/stuff/       = /get/some/stuff
	 * 
	 * @param  {String} path  The path to extract the static portion of
	 * @return {String}       The static portion of the path given
	 */
	function getStaticPortion (path) {
		var _static,
			indexOfCapture,
			indexOfWildcard,
			pathEndsWithSlash = path[path.length - 1],
			staticEndsWithSlash;

		// Search for the the first occurence of a wildcard or capture portion
		indexOfCapture = path.search(/(^|\/)+?:+?[^\/]+?/);
		indexOfWildcard = path.search(/(^|\/)+?[^\/]*?\*{1}/);

		// Both negative - static path
		if (indexOfCapture === -1 && indexOfWildcard === -1) {
			return path;
		}

		// Extract static portion
		_static = path.substr(0, Math.min(
			indexOfCapture !== -1 ? indexOfCapture : path.length,
			indexOfWildcard !== -1 ? indexOfWildcard : path.length
		));

		staticEndsWithSlash = _static[_static.length - 1] === '/';

		// Make sure that the static' trailing slash is uniform with `path`
		if (pathEndsWithSlash && !staticEndsWithSlash) {
			_static += '/';
		} else if (!pathEndsWithSlash && staticEndsWithSlash) {
			_static = _static.substr(0, _static.length - 1);
		}

		return _static;
	}

	/**
	 * Passes given query to 'this.exec' and shifts the first, mandatory, full match.
	 * This function is added as a property to all RegExp-objects that passes Qbus.parse.
	 *
	 * @method     execQuery
	 * @param      {String}  query   String execute
	 * @return     {Null|Array>}     Null if it does not match, otherwise Array.
	 */
	function execQuery (query) {
		var match, i, arr;

		if ((match = this.exec(query))) {
			arr = new Array(match.length - 1);

			for (i = 1; i < match.length; ++i) {
				arr[i - 1] = match[i];
			}

			return arr;
		}

		return match;
	};

	/**
	 * Converts given expression to RegExp.
	 * If a RegExp is given it will copy it and add 'execQuery' to its properties.
	 *
	 * @method     emit
	 * @param      {String|RegExp}  expr   The string to convert or RegExp to add 'execQuery'.
	 * @return     {RegExp}
	 */
	function pathToRegexp (path, opts) {
		var regexp,
			pathBegsWithSlash,
			pathEndsWithSlash,
			length = 0;

		// Typechecking and handling of RegExp type `path`
		if (typeof path !== 'string') {
			if (path instanceof RegExp) {
				regexp = new RegExp(path);
				regexp.query = execQuery;

				return regexp;
			}

			throw new TypeError(
				'Usage: pathToRegexp(<`path` = String|RegExp>[, <`opts` = Object>])\n' + 
				'Got:   pathToRegexp(<`' + typeof path + '` = ' + path + '>, <`' + typeof opts + '` = ' + opts + '>)'
			);
		}

		opts = opts || {
			caseSensitive: false,
			strictLeadingSlash: false,
			strictTrailingSlash: false
		};

		pathBegsWithSlash = path[0] === '/';
		pathEndsWithSlash = path[path.length - 1] === '/';

		// Remove double slashes
		if (path.indexOf('//') !== -1) {
			path = path.replace(reDoubleSlashes, '/');
		}

		// Shift slash
		if (pathBegsWithSlash) {
			path = path.substr(1);
		}
		
		// Pop slash
		if (pathEndsWithSlash) {
			path = path.substr(0, path.length - 1);
		}

		// Pass everything from and including possible beginning frontslash
		// until and not including the next frontslash, to `parseLevel`.
		path = path.replace(reFindDirs, function (match, index) {
			var slashBeg,
				slashEnd,
				firstChar,
				lastChar;

			// Return match if it doesn't contain any modifiers.
			// : must be preceeded by / or start of string to count
			// ? must be used with valid : to count (so we don't need to check for that)
			// * always counts
			if (match.indexOf('*') === -1 && (match.length <= 2 || !reTestForCapture.test(match))) {
				return match.replace(reEscapeRe, '\\$&');
			}

			// Increment `length` (this is a valid param)
			length++;

			// Check if this portion begins and/or ends with a slash
			slashBeg = match[0] === '/' ? '/' : '';
			slashEnd = path[match.length + index] || pathEndsWithSlash;

			// Omit preceeding slash 
			match = slashBeg ? match.substr(1) : match,
			
			firstChar = match[0];
			lastChar = match[match.length - 1];
			
			// Handle captures
			if (firstChar === ':') {
				// Handle optional :capture?
				if (lastChar === '?') {
					// Wrap any preceding slash in the optional capture group
					return (slashBeg ? '(?:/([^/]+?))?' : '([^/]+?)?');
				}

				// Handle mandatory :capture
				return slashBeg + '([^/]+?)';
			}

			// All matches that end with a slash or does not end with * are easy.
			// We'll just choose to capture anything except a frontslash.
			// 
			// /some/stuff*/   =>   /some/stuff([^/]+)?/
			// /some/st*ff/    =>   /some/st([^/]+)?ff/
			if (slashEnd || lastChar !== '*') {
				return slashBeg + match.replace(reFindAllWildcards, '([^/]+)?');
			}

			// Handle all matches that ends with * and are not followed by frontslash; 'stuff*', '*'.
			// We'll replace all asterisks except the last with catch-alls. The last one is omitted and replaced with
			// a pattern that matches everything up until, but not included, the last frontslash in the string or end-of-string.
			// 
			// /some/stuff* => some/stuff(.*?(?:(?=\/$)|(?=$)))?
			// /some/st*ff* => some/st(.*)?ff(.*?(?:(?=\/$)|(?=$)))?
			// /*           => (.*?(?:(?=\\/$)|(?=$)))?
			return slashBeg + match.replace(reFindAsteriskNotFollowedBySlash, '(.*)?').slice(0, -1) + '(.*?(?:(?=/$)|(?=$)))?';
		});

		// Create RegExp object from the parsed query
		regexp = new RegExp('^/?' + path  + '/?$', (opts.caseSensitive ? '' : 'i'));

		// Add `execQuery` and `length` to it's properties
		regexp.query = execQuery;
		regexp.length = length;

		return regexp;
	}

	// 
	pathToRegexp.toFixed = getStaticPortion;

	module.exports = pathToRegexp;

	// Expose
	if (typeof module != 'undefined' && typeof module.exports === 'object') {
		module.exports = pathToRegexp;
	} else if (typeof define === 'function' && define.amd) {
		define([], function () {
			return pathToRegexp;
		});
	} else {
		root.pathToRegexp = pathToRegexp;
	}
}).call(this);