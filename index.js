var pathToRegexp = require('./lib/path-to-regexp'),
	path;

path = ':group/:userId?/:action';
path = 'jo*as';

pathToRegexp(path);

module.exports = pathToRegexp;