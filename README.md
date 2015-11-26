# path-to-regex

  - Vanilla browser, AMD & CommonJS compatible
  - Works completely without hacks, polyfills etc
  - Extensive test suite with 800+ tests
  - No dependencies - one file
  - Small (~1KB gzipped)

## Usage

#### pathToRegex(<`path` = `String`|`RegExp`>*[, `options` = Object]*);
Turns given `path` into a regular expression
```javascript
pathToRegex('/users/:userId/');
pathToRegex('/users/:userId/', {
  caseSensitive: true // default: false
});
```
- **options**
  - **path** String to be converted into a regular expression.
      - or, a regular expression to inherit  custom method `query`
  - **caseSensitive** When `true` the matching will be case sensitive.

#### pathToRegex.toFixed(<`path` = `String`);
Returns the fixed (static) portion of given `path`
```javascript
pathToRegex.toFixed('/users/:userId/'); //-> /users/
pathToRegex.toFixed('/users/:userId');  //-> /users
pathToRegex.toFixed('/:page/');         //-> /
pathToRegex.toFixed('/i/like/turt*es'); //-> /i/like

var containsModifiers = pathToRegex.toFixed(path) === path;
```
- **options**
  - **path** String of which to extract the fixed portion from


### Modifiers
#### :capture
A mandatory capture group
```javascript
var re = pathToRegex('/users/:userId');
```

#### :optional?
An optional capture group
```javascript
var re = pathToRegex('/users/:userId?');
```

#### * (wildcard)
A zero-or-more modifier
```javascript
var re = pathToRegex('/page/*/update*');
```
