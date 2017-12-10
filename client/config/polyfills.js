'use strict';

var modernBrowser = ('fetch' in window && 'assign' in Object)

if (!modernBrowser) {
  // fetch() polyfill for making API calls.
  require('whatwg-fetch');

  //This means you can use new built-ins like Promise or WeakMap, static methods like Array.from or Object.assign, instance methods like Array.prototype.includes, and generator functions (provided you use the regenerator plugin). The polyfill adds to the global scope as well as native prototypes like String in order to do this.
  require('babel-polyfill');  
}

