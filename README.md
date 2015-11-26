# path-to-regex

  - Vanilla browser, AMD & CommonJS compatible
  - Works completely without hacks, polyfills etc
  - Extensive test suite with 800+ tests
  - No dependencies - one file
  - Small (~1KB gzipped)

## Usage

##### pathToRegex(<`path` = `String`|`RegExp`>*[, `options` = Object]*);
Turns given `path` into a regular expression
```javascript
pathToRegex('/users/:userId/');
pathToRegex('/users/:userId/', {
  caseSensitive: true // default: false
});
```

##### pathToRegex.toFixed(<`path` = `String`);
Returns the fixed (static) portion of given `path`
```javascript
pathToRegex.toFixed('/users/:userId/'); //-> /users/
pathToRegex.toFixed('/users/:userId');  //-> /users
pathToRegex.toFixed('/:page/');         //-> /
pathToRegex.toFixed('/i/like/turt*es'); //-> /i/like

```
