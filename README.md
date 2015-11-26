# path-to-regex

  - Vanilla browser, AMD & CommonJS compatible
  - Works completely without hacks, polyfills etc
  - Extensive test suite with 800+ tests
  - No dependencies - one file
  - Small (~1KB gzipped)

## Usage

##### pathToRegex(<`path` = `String`|`RegExp`>*[, `options` = Object]*);
```javascript
pathToRegex('/users/:userId/');
pathToRegex('/users/:userId/', {
  caseSensitive: true // default: false
});
```
