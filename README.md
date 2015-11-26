[![Build Status](https://travis-ci.org/unkelpehr/path-to-regex.svg?branch=master)](https://travis-ci.org/unkelpehr/path-to-regex)

# path-to-regex

  - Vanilla browser, AMD & CommonJS compatible
  - Works completely without hacks, polyfills etc
  - Extensive test suite with 800+ tests
  - No dependencies - one file
  - Fast and small (~1KB gzipped)

## Usage

#### pathToRegex(<`path` = `String`|`RegExp`>*[, `options` = Object]*);
Turns given `path` into a regular expression
```javascript
pathToRegex('/users/:userId/');
pathToRegex('/users/:userId/', {
  caseSensitive: true // default: false
});
```

- **path** String to be converted into a regular expression.
    - *or a regular expression to inherit  custom method `query`*
- **options**
  - **caseSensitive** When `true` the matching will be case sensitive.

**The return value** of pathToRegex is a RegExp object with added properties (explanation down below) 

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

re.query('/users/abc')        //-> ['abc']
re.query('/users/18')         //-> ['18']
re.query('/users/')           //-> null
re.query('/users/18/more')    //-> null
```

#### :optional?
An optional capture group
```javascript
var re = pathToRegex('/users/:userId?');

re.query('/users/abc')      //-> ['abc']
re.query('/users/18')       //-> ['18']
re.query('/users/')         //-> [undefined]
re.query('/users/18/more')  //-> null
```

#### * (wildcard)
A zero-or-more modifier
```javascript
var re = pathToRegex('/page/*/update*');

re.query('/page/index/updateStuff') //-> ['index', 'Stuff']
re.query('/page/updateStuff')       //-> [undefined, 'Stuff']
re.query('/page/update')            //-> [undefined, undefined]
re.query('/page/updaate')           //-> null
```

### The returned RegExp
Is a proper RegExp instance but with to properties added:
- ***Function* `query`**
  - *Identical to the native `RegExp.exec`* ***but*** *it pops the first mandatory full-match*
- ***Number* `length`** The number of modifiers present in the path
  - *pathToRegexp('/users/:userId?/:action).length => 2*
