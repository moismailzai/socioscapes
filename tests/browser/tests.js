(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util = require('util/');

var pSlice = Array.prototype.slice;
var hasOwn = Object.prototype.hasOwnProperty;

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
  else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = stackStartFunction.name;
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (util.isUndefined(value)) {
    return '' + value;
  }
  if (util.isNumber(value) && !isFinite(value)) {
    return value.toString();
  }
  if (util.isFunction(value) || util.isRegExp(value)) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (util.isString(s)) {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

function getMessage(self) {
  return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
         self.operator + ' ' +
         truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (!util.isObject(actual) && !util.isObject(expected)) {
    return actual == expected;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b)) {
    return a === b;
  }
  var aIsArgs = isArguments(a),
      bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  var ka = objectKeys(a),
      kb = objectKeys(b),
      key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (util.isString(expected)) {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

},{"util/":6}],2:[function(require,module,exports){

/**
 * @license
 *
 * chroma.js - JavaScript library for color conversions
 * 
 * Copyright (c) 2011-2015, Gregor Aisch
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 *    derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

(function() {
  var Color, DEG2RAD, LAB_CONSTANTS, PI, PITHIRD, RAD2DEG, TWOPI, _guess_formats, _guess_formats_sorted, _input, _interpolators, abs, atan2, bezier, blend, blend_f, brewer, burn, chroma, clip_rgb, cmyk2rgb, colors, cos, css2rgb, darken, dodge, each, floor, hex2rgb, hsi2rgb, hsl2css, hsl2rgb, hsv2rgb, interpolate, interpolate_hsx, interpolate_lab, interpolate_num, interpolate_rgb, lab2lch, lab2rgb, lab_xyz, lch2lab, lch2rgb, lighten, limit, log, luminance_x, m, max, multiply, normal, num2rgb, overlay, pow, rgb2cmyk, rgb2css, rgb2hex, rgb2hsi, rgb2hsl, rgb2hsv, rgb2lab, rgb2lch, rgb2luminance, rgb2num, rgb2temperature, rgb2xyz, rgb_xyz, rnd, root, round, screen, sin, sqrt, temperature2rgb, type, unpack, w3cx11, xyz_lab, xyz_rgb,
    slice = [].slice;

  type = (function() {

    /*
    for browser-safe type checking+
    ported from jQuery's $.type
     */
    var classToType, len, name, o, ref;
    classToType = {};
    ref = "Boolean Number String Function Array Date RegExp Undefined Null".split(" ");
    for (o = 0, len = ref.length; o < len; o++) {
      name = ref[o];
      classToType["[object " + name + "]"] = name.toLowerCase();
    }
    return function(obj) {
      var strType;
      strType = Object.prototype.toString.call(obj);
      return classToType[strType] || "object";
    };
  })();

  limit = function(x, min, max) {
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 1;
    }
    if (x < min) {
      x = min;
    }
    if (x > max) {
      x = max;
    }
    return x;
  };

  unpack = function(args) {
    if (args.length >= 3) {
      return [].slice.call(args);
    } else {
      return args[0];
    }
  };

  clip_rgb = function(rgb) {
    var i;
    for (i in rgb) {
      if (i < 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0;
        }
        if (rgb[i] > 255) {
          rgb[i] = 255;
        }
      } else if (i === 3) {
        if (rgb[i] < 0) {
          rgb[i] = 0;
        }
        if (rgb[i] > 1) {
          rgb[i] = 1;
        }
      }
    }
    return rgb;
  };

  PI = Math.PI, round = Math.round, cos = Math.cos, floor = Math.floor, pow = Math.pow, log = Math.log, sin = Math.sin, sqrt = Math.sqrt, atan2 = Math.atan2, max = Math.max, abs = Math.abs;

  TWOPI = PI * 2;

  PITHIRD = PI / 3;

  DEG2RAD = PI / 180;

  RAD2DEG = 180 / PI;

  chroma = function() {
    if (arguments[0] instanceof Color) {
      return arguments[0];
    }
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, arguments, function(){});
  };

  _interpolators = [];

  if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
    module.exports = chroma;
  }

  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return chroma;
    });
  } else {
    root = typeof exports !== "undefined" && exports !== null ? exports : this;
    root.chroma = chroma;
  }

  chroma.version = '1.1.1';


  /**
      chroma.js
  
      Copyright (c) 2011-2013, Gregor Aisch
      All rights reserved.
  
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are met:
  
      * Redistributions of source code must retain the above copyright notice, this
        list of conditions and the following disclaimer.
  
      * Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.
  
      * The name Gregor Aisch may not be used to endorse or promote products
        derived from this software without specific prior written permission.
  
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
      AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
      IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
      DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
      INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
      BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
      DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
      OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
      EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  
      @source: https://github.com/gka/chroma.js
   */

  _input = {};

  _guess_formats = [];

  _guess_formats_sorted = false;

  Color = (function() {
    function Color() {
      var arg, args, chk, len, len1, me, mode, o, w;
      me = this;
      args = [];
      for (o = 0, len = arguments.length; o < len; o++) {
        arg = arguments[o];
        if (arg != null) {
          args.push(arg);
        }
      }
      mode = args[args.length - 1];
      if (_input[mode] != null) {
        me._rgb = clip_rgb(_input[mode](unpack(args.slice(0, -1))));
      } else {
        if (!_guess_formats_sorted) {
          _guess_formats = _guess_formats.sort(function(a, b) {
            return b.p - a.p;
          });
          _guess_formats_sorted = true;
        }
        for (w = 0, len1 = _guess_formats.length; w < len1; w++) {
          chk = _guess_formats[w];
          mode = chk.test.apply(chk, args);
          if (mode) {
            break;
          }
        }
        if (mode) {
          me._rgb = clip_rgb(_input[mode].apply(_input, args));
        }
      }
      if (me._rgb == null) {
        console.warn('unknown format: ' + args);
      }
      if (me._rgb == null) {
        me._rgb = [0, 0, 0];
      }
      if (me._rgb.length === 3) {
        me._rgb.push(1);
      }
    }

    Color.prototype.alpha = function(alpha) {
      if (arguments.length) {
        this._rgb[3] = alpha;
        return this;
      }
      return this._rgb[3];
    };

    Color.prototype.toString = function() {
      return this.name();
    };

    return Color;

  })();

  chroma._input = _input;


  /**
  	ColorBrewer colors for chroma.js
  
  	Copyright (c) 2002 Cynthia Brewer, Mark Harrower, and The 
  	Pennsylvania State University.
  
  	Licensed under the Apache License, Version 2.0 (the "License"); 
  	you may not use this file except in compliance with the License.
  	You may obtain a copy of the License at	
  	http://www.apache.org/licenses/LICENSE-2.0
  
  	Unless required by applicable law or agreed to in writing, software distributed
  	under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
  	CONDITIONS OF ANY KIND, either express or implied. See the License for the
  	specific language governing permissions and limitations under the License.
  
      @preserve
   */

  chroma.brewer = brewer = {
    OrRd: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'],
    PuBu: ['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'],
    BuPu: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'],
    Oranges: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d94801', '#a63603', '#7f2704'],
    BuGn: ['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'],
    YlOrBr: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'],
    YlGn: ['#ffffe5', '#f7fcb9', '#d9f0a3', '#addd8e', '#78c679', '#41ab5d', '#238443', '#006837', '#004529'],
    Reds: ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    RdPu: ['#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5', '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'],
    Greens: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    YlGnBu: ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb', '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58'],
    Purples: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    GnBu: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'],
    Greys: ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    YlOrRd: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'],
    PuRd: ['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'],
    Blues: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    PuBuGn: ['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'],
    Spectral: ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', '#3288bd', '#5e4fa2'],
    RdYlGn: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'],
    RdBu: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac', '#053061'],
    PiYG: ['#8e0152', '#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', '#4d9221', '#276419'],
    PRGn: ['#40004b', '#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', '#1b7837', '#00441b'],
    RdYlBu: ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695'],
    BrBG: ['#543005', '#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', '#01665e', '#003c30'],
    RdGy: ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'],
    PuOr: ['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', '#542788', '#2d004b'],
    Set2: ['#66c2a5', '#fc8d62', '#8da0cb', '#e78ac3', '#a6d854', '#ffd92f', '#e5c494', '#b3b3b3'],
    Accent: ['#7fc97f', '#beaed4', '#fdc086', '#ffff99', '#386cb0', '#f0027f', '#bf5b17', '#666666'],
    Set1: ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'],
    Set3: ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd', '#ccebc5', '#ffed6f'],
    Dark2: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
    Paired: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
    Pastel2: ['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae', '#f1e2cc', '#cccccc'],
    Pastel1: ['#fbb4ae', '#b3cde3', '#ccebc5', '#decbe4', '#fed9a6', '#ffffcc', '#e5d8bd', '#fddaec', '#f2f2f2']
  };


  /**
  	X11 color names
  
  	http://www.w3.org/TR/css3-color/#svg-color
   */

  w3cx11 = {
    indigo: "#4b0082",
    gold: "#ffd700",
    hotpink: "#ff69b4",
    firebrick: "#b22222",
    indianred: "#cd5c5c",
    yellow: "#ffff00",
    mistyrose: "#ffe4e1",
    darkolivegreen: "#556b2f",
    olive: "#808000",
    darkseagreen: "#8fbc8f",
    pink: "#ffc0cb",
    tomato: "#ff6347",
    lightcoral: "#f08080",
    orangered: "#ff4500",
    navajowhite: "#ffdead",
    lime: "#00ff00",
    palegreen: "#98fb98",
    darkslategrey: "#2f4f4f",
    greenyellow: "#adff2f",
    burlywood: "#deb887",
    seashell: "#fff5ee",
    mediumspringgreen: "#00fa9a",
    fuchsia: "#ff00ff",
    papayawhip: "#ffefd5",
    blanchedalmond: "#ffebcd",
    chartreuse: "#7fff00",
    dimgray: "#696969",
    black: "#000000",
    peachpuff: "#ffdab9",
    springgreen: "#00ff7f",
    aquamarine: "#7fffd4",
    white: "#ffffff",
    orange: "#ffa500",
    lightsalmon: "#ffa07a",
    darkslategray: "#2f4f4f",
    brown: "#a52a2a",
    ivory: "#fffff0",
    dodgerblue: "#1e90ff",
    peru: "#cd853f",
    lawngreen: "#7cfc00",
    chocolate: "#d2691e",
    crimson: "#dc143c",
    forestgreen: "#228b22",
    darkgrey: "#a9a9a9",
    lightseagreen: "#20b2aa",
    cyan: "#00ffff",
    mintcream: "#f5fffa",
    silver: "#c0c0c0",
    antiquewhite: "#faebd7",
    mediumorchid: "#ba55d3",
    skyblue: "#87ceeb",
    gray: "#808080",
    darkturquoise: "#00ced1",
    goldenrod: "#daa520",
    darkgreen: "#006400",
    floralwhite: "#fffaf0",
    darkviolet: "#9400d3",
    darkgray: "#a9a9a9",
    moccasin: "#ffe4b5",
    saddlebrown: "#8b4513",
    grey: "#808080",
    darkslateblue: "#483d8b",
    lightskyblue: "#87cefa",
    lightpink: "#ffb6c1",
    mediumvioletred: "#c71585",
    slategrey: "#708090",
    red: "#ff0000",
    deeppink: "#ff1493",
    limegreen: "#32cd32",
    darkmagenta: "#8b008b",
    palegoldenrod: "#eee8aa",
    plum: "#dda0dd",
    turquoise: "#40e0d0",
    lightgrey: "#d3d3d3",
    lightgoldenrodyellow: "#fafad2",
    darkgoldenrod: "#b8860b",
    lavender: "#e6e6fa",
    maroon: "#800000",
    yellowgreen: "#9acd32",
    sandybrown: "#f4a460",
    thistle: "#d8bfd8",
    violet: "#ee82ee",
    navy: "#000080",
    magenta: "#ff00ff",
    dimgrey: "#696969",
    tan: "#d2b48c",
    rosybrown: "#bc8f8f",
    olivedrab: "#6b8e23",
    blue: "#0000ff",
    lightblue: "#add8e6",
    ghostwhite: "#f8f8ff",
    honeydew: "#f0fff0",
    cornflowerblue: "#6495ed",
    slateblue: "#6a5acd",
    linen: "#faf0e6",
    darkblue: "#00008b",
    powderblue: "#b0e0e6",
    seagreen: "#2e8b57",
    darkkhaki: "#bdb76b",
    snow: "#fffafa",
    sienna: "#a0522d",
    mediumblue: "#0000cd",
    royalblue: "#4169e1",
    lightcyan: "#e0ffff",
    green: "#008000",
    mediumpurple: "#9370db",
    midnightblue: "#191970",
    cornsilk: "#fff8dc",
    paleturquoise: "#afeeee",
    bisque: "#ffe4c4",
    slategray: "#708090",
    darkcyan: "#008b8b",
    khaki: "#f0e68c",
    wheat: "#f5deb3",
    teal: "#008080",
    darkorchid: "#9932cc",
    deepskyblue: "#00bfff",
    salmon: "#fa8072",
    darkred: "#8b0000",
    steelblue: "#4682b4",
    palevioletred: "#db7093",
    lightslategray: "#778899",
    aliceblue: "#f0f8ff",
    lightslategrey: "#778899",
    lightgreen: "#90ee90",
    orchid: "#da70d6",
    gainsboro: "#dcdcdc",
    mediumseagreen: "#3cb371",
    lightgray: "#d3d3d3",
    mediumturquoise: "#48d1cc",
    lemonchiffon: "#fffacd",
    cadetblue: "#5f9ea0",
    lightyellow: "#ffffe0",
    lavenderblush: "#fff0f5",
    coral: "#ff7f50",
    purple: "#800080",
    aqua: "#00ffff",
    whitesmoke: "#f5f5f5",
    mediumslateblue: "#7b68ee",
    darkorange: "#ff8c00",
    mediumaquamarine: "#66cdaa",
    darksalmon: "#e9967a",
    beige: "#f5f5dc",
    blueviolet: "#8a2be2",
    azure: "#f0ffff",
    lightsteelblue: "#b0c4de",
    oldlace: "#fdf5e6",
    rebeccapurple: "#663399"
  };

  chroma.colors = colors = w3cx11;

  lab2rgb = function() {
    var a, args, b, g, l, r, x, y, z;
    args = unpack(arguments);
    l = args[0], a = args[1], b = args[2];
    y = (l + 16) / 116;
    x = isNaN(a) ? y : y + a / 500;
    z = isNaN(b) ? y : y - b / 200;
    y = LAB_CONSTANTS.Yn * lab_xyz(y);
    x = LAB_CONSTANTS.Xn * lab_xyz(x);
    z = LAB_CONSTANTS.Zn * lab_xyz(z);
    r = xyz_rgb(3.2404542 * x - 1.5371385 * y - 0.4985314 * z);
    g = xyz_rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z);
    b = xyz_rgb(0.0556434 * x - 0.2040259 * y + 1.0572252 * z);
    r = limit(r, 0, 255);
    g = limit(g, 0, 255);
    b = limit(b, 0, 255);
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  xyz_rgb = function(r) {
    return round(255 * (r <= 0.00304 ? 12.92 * r : 1.055 * pow(r, 1 / 2.4) - 0.055));
  };

  lab_xyz = function(t) {
    if (t > LAB_CONSTANTS.t1) {
      return t * t * t;
    } else {
      return LAB_CONSTANTS.t2 * (t - LAB_CONSTANTS.t0);
    }
  };

  LAB_CONSTANTS = {
    Kn: 18,
    Xn: 0.950470,
    Yn: 1,
    Zn: 1.088830,
    t0: 0.137931034,
    t1: 0.206896552,
    t2: 0.12841855,
    t3: 0.008856452
  };

  rgb2lab = function() {
    var b, g, r, ref, ref1, x, y, z;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    ref1 = rgb2xyz(r, g, b), x = ref1[0], y = ref1[1], z = ref1[2];
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };

  rgb_xyz = function(r) {
    if ((r /= 255) <= 0.04045) {
      return r / 12.92;
    } else {
      return pow((r + 0.055) / 1.055, 2.4);
    }
  };

  xyz_lab = function(t) {
    if (t > LAB_CONSTANTS.t3) {
      return pow(t, 1 / 3);
    } else {
      return t / LAB_CONSTANTS.t2 + LAB_CONSTANTS.t0;
    }
  };

  rgb2xyz = function() {
    var b, g, r, ref, x, y, z;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = rgb_xyz(r);
    g = rgb_xyz(g);
    b = rgb_xyz(b);
    x = xyz_lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / LAB_CONSTANTS.Xn);
    y = xyz_lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / LAB_CONSTANTS.Yn);
    z = xyz_lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / LAB_CONSTANTS.Zn);
    return [x, y, z];
  };

  chroma.lab = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['lab']), function(){});
  };

  _input.lab = lab2rgb;

  Color.prototype.lab = function() {
    return rgb2lab(this._rgb);
  };

  bezier = function(colors) {
    var I, I0, I1, c, lab0, lab1, lab2, lab3, ref, ref1, ref2;
    colors = (function() {
      var len, o, results;
      results = [];
      for (o = 0, len = colors.length; o < len; o++) {
        c = colors[o];
        results.push(chroma(c));
      }
      return results;
    })();
    if (colors.length === 2) {
      ref = (function() {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      })(), lab0 = ref[0], lab1 = ref[1];
      I = function(t) {
        var i, lab;
        lab = (function() {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push(lab0[i] + t * (lab1[i] - lab0[i]));
          }
          return results;
        })();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 3) {
      ref1 = (function() {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      })(), lab0 = ref1[0], lab1 = ref1[1], lab2 = ref1[2];
      I = function(t) {
        var i, lab;
        lab = (function() {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push((1 - t) * (1 - t) * lab0[i] + 2 * (1 - t) * t * lab1[i] + t * t * lab2[i]);
          }
          return results;
        })();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 4) {
      ref2 = (function() {
        var len, o, results;
        results = [];
        for (o = 0, len = colors.length; o < len; o++) {
          c = colors[o];
          results.push(c.lab());
        }
        return results;
      })(), lab0 = ref2[0], lab1 = ref2[1], lab2 = ref2[2], lab3 = ref2[3];
      I = function(t) {
        var i, lab;
        lab = (function() {
          var o, results;
          results = [];
          for (i = o = 0; o <= 2; i = ++o) {
            results.push((1 - t) * (1 - t) * (1 - t) * lab0[i] + 3 * (1 - t) * (1 - t) * t * lab1[i] + 3 * (1 - t) * t * t * lab2[i] + t * t * t * lab3[i]);
          }
          return results;
        })();
        return chroma.lab.apply(chroma, lab);
      };
    } else if (colors.length === 5) {
      I0 = bezier(colors.slice(0, 3));
      I1 = bezier(colors.slice(2, 5));
      I = function(t) {
        if (t < 0.5) {
          return I0(t * 2);
        } else {
          return I1((t - 0.5) * 2);
        }
      };
    }
    return I;
  };

  chroma.bezier = function(colors) {
    var f;
    f = bezier(colors);
    f.scale = function() {
      return chroma.scale(f);
    };
    return f;
  };


  /*
      chroma.js
  
      Copyright (c) 2011-2013, Gregor Aisch
      All rights reserved.
  
      Redistribution and use in source and binary forms, with or without
      modification, are permitted provided that the following conditions are met:
  
      * Redistributions of source code must retain the above copyright notice, this
        list of conditions and the following disclaimer.
  
      * Redistributions in binary form must reproduce the above copyright notice,
        this list of conditions and the following disclaimer in the documentation
        and/or other materials provided with the distribution.
  
      * The name Gregor Aisch may not be used to endorse or promote products
        derived from this software without specific prior written permission.
  
      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
      AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
      IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
      DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
      INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
      BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
      DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
      OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
      NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
      EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  
      @source: https://github.com/gka/chroma.js
   */

  chroma.cubehelix = function(start, rotations, hue, gamma, lightness) {
    var dh, dl, f;
    if (start == null) {
      start = 300;
    }
    if (rotations == null) {
      rotations = -1.5;
    }
    if (hue == null) {
      hue = 1;
    }
    if (gamma == null) {
      gamma = 1;
    }
    if (lightness == null) {
      lightness = [0, 1];
    }
    dl = lightness[1] - lightness[0];
    dh = 0;
    f = function(fract) {
      var a, amp, b, cos_a, g, h, l, r, sin_a;
      a = TWOPI * ((start + 120) / 360 + rotations * fract);
      l = pow(lightness[0] + dl * fract, gamma);
      h = dh !== 0 ? hue[0] + fract * dh : hue;
      amp = h * l * (1 - l) / 2;
      cos_a = cos(a);
      sin_a = sin(a);
      r = l + amp * (-0.14861 * cos_a + 1.78277 * sin_a);
      g = l + amp * (-0.29227 * cos_a - 0.90649 * sin_a);
      b = l + amp * (+1.97294 * cos_a);
      return chroma(clip_rgb([r * 255, g * 255, b * 255]));
    };
    f.start = function(s) {
      if (s == null) {
        return start;
      }
      start = s;
      return f;
    };
    f.rotations = function(r) {
      if (r == null) {
        return rotations;
      }
      rotations = r;
      return f;
    };
    f.gamma = function(g) {
      if (g == null) {
        return gamma;
      }
      gamma = g;
      return f;
    };
    f.hue = function(h) {
      if (h == null) {
        return hue;
      }
      hue = h;
      if (type(hue) === 'array') {
        dh = hue[1] - hue[0];
        if (dh === 0) {
          hue = hue[1];
        }
      } else {
        dh = 0;
      }
      return f;
    };
    f.lightness = function(h) {
      if (h == null) {
        return lightness;
      }
      lightness = h;
      if (type(lightness) === 'array') {
        dl = lightness[1] - lightness[0];
        if (dl === 0) {
          lightness = lightness[1];
        }
      } else {
        dl = 0;
      }
      return f;
    };
    f.scale = function() {
      return chroma.scale(f);
    };
    f.hue(hue);
    return f;
  };

  chroma.random = function() {
    var code, digits, i, o;
    digits = '0123456789abcdef';
    code = '#';
    for (i = o = 0; o < 6; i = ++o) {
      code += digits.charAt(floor(Math.random() * 16));
    }
    return new Color(code);
  };

  _input.rgb = function() {
    var k, ref, results, v;
    ref = unpack(arguments);
    results = [];
    for (k in ref) {
      v = ref[k];
      results.push(v);
    }
    return results;
  };

  chroma.rgb = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['rgb']), function(){});
  };

  Color.prototype.rgb = function() {
    return this._rgb.slice(0, 3);
  };

  Color.prototype.rgba = function() {
    return this._rgb;
  };

  _guess_formats.push({
    p: 15,
    test: function(n) {
      var a;
      a = unpack(arguments);
      if (type(a) === 'array' && a.length === 3) {
        return 'rgb';
      }
      if (a.length === 4 && type(a[3]) === "number" && a[3] >= 0 && a[3] <= 1) {
        return 'rgb';
      }
    }
  });

  hex2rgb = function(hex) {
    var a, b, g, r, rgb, u;
    if (hex.match(/^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      if (hex.length === 4 || hex.length === 7) {
        hex = hex.substr(1);
      }
      if (hex.length === 3) {
        hex = hex.split("");
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      u = parseInt(hex, 16);
      r = u >> 16;
      g = u >> 8 & 0xFF;
      b = u & 0xFF;
      return [r, g, b, 1];
    }
    if (hex.match(/^#?([A-Fa-f0-9]{8})$/)) {
      if (hex.length === 9) {
        hex = hex.substr(1);
      }
      u = parseInt(hex, 16);
      r = u >> 24 & 0xFF;
      g = u >> 16 & 0xFF;
      b = u >> 8 & 0xFF;
      a = round((u & 0xFF) / 0xFF * 100) / 100;
      return [r, g, b, a];
    }
    if ((_input.css != null) && (rgb = _input.css(hex))) {
      return rgb;
    }
    throw "unknown color: " + hex;
  };

  rgb2hex = function(channels, mode) {
    var a, b, g, hxa, r, str, u;
    if (mode == null) {
      mode = 'rgb';
    }
    r = channels[0], g = channels[1], b = channels[2], a = channels[3];
    u = r << 16 | g << 8 | b;
    str = "000000" + u.toString(16);
    str = str.substr(str.length - 6);
    hxa = '0' + round(a * 255).toString(16);
    hxa = hxa.substr(hxa.length - 2);
    return "#" + (function() {
      switch (mode.toLowerCase()) {
        case 'rgba':
          return str + hxa;
        case 'argb':
          return hxa + str;
        default:
          return str;
      }
    })();
  };

  _input.hex = function(h) {
    return hex2rgb(h);
  };

  chroma.hex = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['hex']), function(){});
  };

  Color.prototype.hex = function(mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    return rgb2hex(this._rgb, mode);
  };

  _guess_formats.push({
    p: 10,
    test: function(n) {
      if (arguments.length === 1 && type(n) === "string") {
        return 'hex';
      }
    }
  });

  hsl2rgb = function() {
    var args, b, c, g, h, i, l, o, r, ref, s, t1, t2, t3;
    args = unpack(arguments);
    h = args[0], s = args[1], l = args[2];
    if (s === 0) {
      r = g = b = l * 255;
    } else {
      t3 = [0, 0, 0];
      c = [0, 0, 0];
      t2 = l < 0.5 ? l * (1 + s) : l + s - l * s;
      t1 = 2 * l - t2;
      h /= 360;
      t3[0] = h + 1 / 3;
      t3[1] = h;
      t3[2] = h - 1 / 3;
      for (i = o = 0; o <= 2; i = ++o) {
        if (t3[i] < 0) {
          t3[i] += 1;
        }
        if (t3[i] > 1) {
          t3[i] -= 1;
        }
        if (6 * t3[i] < 1) {
          c[i] = t1 + (t2 - t1) * 6 * t3[i];
        } else if (2 * t3[i] < 1) {
          c[i] = t2;
        } else if (3 * t3[i] < 2) {
          c[i] = t1 + (t2 - t1) * ((2 / 3) - t3[i]) * 6;
        } else {
          c[i] = t1;
        }
      }
      ref = [round(c[0] * 255), round(c[1] * 255), round(c[2] * 255)], r = ref[0], g = ref[1], b = ref[2];
    }
    if (args.length > 3) {
      return [r, g, b, args[3]];
    } else {
      return [r, g, b];
    }
  };

  rgb2hsl = function(r, g, b) {
    var h, l, min, ref, s;
    if (r !== void 0 && r.length >= 3) {
      ref = r, r = ref[0], g = ref[1], b = ref[2];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = Number.NaN;
    } else {
      s = l < 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min);
    }
    if (r === max) {
      h = (g - b) / (max - min);
    } else if (g === max) {
      h = 2 + (b - r) / (max - min);
    } else if (b === max) {
      h = 4 + (r - g) / (max - min);
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
    return [h, s, l];
  };

  chroma.hsl = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['hsl']), function(){});
  };

  _input.hsl = hsl2rgb;

  Color.prototype.hsl = function() {
    return rgb2hsl(this._rgb);
  };

  hsv2rgb = function() {
    var args, b, f, g, h, i, p, q, r, ref, ref1, ref2, ref3, ref4, ref5, s, t, v;
    args = unpack(arguments);
    h = args[0], s = args[1], v = args[2];
    v *= 255;
    if (s === 0) {
      r = g = b = v;
    } else {
      if (h === 360) {
        h = 0;
      }
      if (h > 360) {
        h -= 360;
      }
      if (h < 0) {
        h += 360;
      }
      h /= 60;
      i = floor(h);
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
        case 0:
          ref = [v, t, p], r = ref[0], g = ref[1], b = ref[2];
          break;
        case 1:
          ref1 = [q, v, p], r = ref1[0], g = ref1[1], b = ref1[2];
          break;
        case 2:
          ref2 = [p, v, t], r = ref2[0], g = ref2[1], b = ref2[2];
          break;
        case 3:
          ref3 = [p, q, v], r = ref3[0], g = ref3[1], b = ref3[2];
          break;
        case 4:
          ref4 = [t, p, v], r = ref4[0], g = ref4[1], b = ref4[2];
          break;
        case 5:
          ref5 = [v, p, q], r = ref5[0], g = ref5[1], b = ref5[2];
      }
    }
    r = round(r);
    g = round(g);
    b = round(b);
    return [r, g, b, args.length > 3 ? args[3] : 1];
  };

  rgb2hsv = function() {
    var b, delta, g, h, min, r, ref, s, v;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    v = max / 255.0;
    if (max === 0) {
      h = Number.NaN;
      s = 0;
    } else {
      s = delta / max;
      if (r === max) {
        h = (g - b) / delta;
      }
      if (g === max) {
        h = 2 + (b - r) / delta;
      }
      if (b === max) {
        h = 4 + (r - g) / delta;
      }
      h *= 60;
      if (h < 0) {
        h += 360;
      }
    }
    return [h, s, v];
  };

  chroma.hsv = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['hsv']), function(){});
  };

  _input.hsv = hsv2rgb;

  Color.prototype.hsv = function() {
    return rgb2hsv(this._rgb);
  };

  num2rgb = function(num) {
    var b, g, r;
    if (type(num) === "number" && num >= 0 && num <= 0xFFFFFF) {
      r = num >> 16;
      g = (num >> 8) & 0xFF;
      b = num & 0xFF;
      return [r, g, b, 1];
    }
    console.warn("unknown num color: " + num);
    return [0, 0, 0, 1];
  };

  rgb2num = function() {
    var b, g, r, ref;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    return (r << 16) + (g << 8) + b;
  };

  chroma.num = function(num) {
    return new Color(num, 'num');
  };

  Color.prototype.num = function(mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    return rgb2num(this._rgb, mode);
  };

  _input.num = num2rgb;

  _guess_formats.push({
    p: 10,
    test: function(n) {
      if (arguments.length === 1 && type(n) === "number" && n >= 0 && n <= 0xFFFFFF) {
        return 'num';
      }
    }
  });

  css2rgb = function(css) {
    var aa, ab, hsl, i, m, o, rgb, w;
    css = css.toLowerCase();
    if ((chroma.colors != null) && chroma.colors[css]) {
      return hex2rgb(chroma.colors[css]);
    }
    if (m = css.match(/rgb\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = o = 0; o <= 2; i = ++o) {
        rgb[i] = +rgb[i];
      }
      rgb[3] = 1;
    } else if (m = css.match(/rgba\(\s*(\-?\d+),\s*(\-?\d+)\s*,\s*(\-?\d+)\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = w = 0; w <= 3; i = ++w) {
        rgb[i] = +rgb[i];
      }
    } else if (m = css.match(/rgb\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      rgb = m.slice(1, 4);
      for (i = aa = 0; aa <= 2; i = ++aa) {
        rgb[i] = round(rgb[i] * 2.55);
      }
      rgb[3] = 1;
    } else if (m = css.match(/rgba\(\s*(\-?\d+(?:\.\d+)?)%,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      rgb = m.slice(1, 5);
      for (i = ab = 0; ab <= 2; i = ++ab) {
        rgb[i] = round(rgb[i] * 2.55);
      }
      rgb[3] = +rgb[3];
    } else if (m = css.match(/hsl\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= 0.01;
      hsl[2] *= 0.01;
      rgb = hsl2rgb(hsl);
      rgb[3] = 1;
    } else if (m = css.match(/hsla\(\s*(\-?\d+(?:\.\d+)?),\s*(\-?\d+(?:\.\d+)?)%\s*,\s*(\-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)/)) {
      hsl = m.slice(1, 4);
      hsl[1] *= 0.01;
      hsl[2] *= 0.01;
      rgb = hsl2rgb(hsl);
      rgb[3] = +m[4];
    }
    return rgb;
  };

  rgb2css = function(rgba) {
    var mode;
    mode = rgba[3] < 1 ? 'rgba' : 'rgb';
    if (mode === 'rgb') {
      return mode + '(' + rgba.slice(0, 3).map(round).join(',') + ')';
    } else if (mode === 'rgba') {
      return mode + '(' + rgba.slice(0, 3).map(round).join(',') + ',' + rgba[3] + ')';
    } else {

    }
  };

  rnd = function(a) {
    return round(a * 100) / 100;
  };

  hsl2css = function(hsl, alpha) {
    var mode;
    mode = alpha < 1 ? 'hsla' : 'hsl';
    hsl[0] = rnd(hsl[0] || 0);
    hsl[1] = rnd(hsl[1] * 100) + '%';
    hsl[2] = rnd(hsl[2] * 100) + '%';
    if (mode === 'hsla') {
      hsl[3] = alpha;
    }
    return mode + '(' + hsl.join(',') + ')';
  };

  _input.css = function(h) {
    return css2rgb(h);
  };

  chroma.css = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['css']), function(){});
  };

  Color.prototype.css = function(mode) {
    if (mode == null) {
      mode = 'rgb';
    }
    if (mode.slice(0, 3) === 'rgb') {
      return rgb2css(this._rgb);
    } else if (mode.slice(0, 3) === 'hsl') {
      return hsl2css(this.hsl(), this.alpha());
    }
  };

  _input.named = function(name) {
    return hex2rgb(w3cx11[name]);
  };

  _guess_formats.push({
    p: 20,
    test: function(n) {
      if (arguments.length === 1 && (w3cx11[n] != null)) {
        return 'named';
      }
    }
  });

  Color.prototype.name = function(n) {
    var h, k;
    if (arguments.length) {
      if (w3cx11[n]) {
        this._rgb = hex2rgb(w3cx11[n]);
      }
      this._rgb[3] = 1;
      this;
    }
    h = this.hex();
    for (k in w3cx11) {
      if (h === w3cx11[k]) {
        return k;
      }
    }
    return h;
  };

  lch2lab = function() {

    /*
    Convert from a qualitative parameter h and a quantitative parameter l to a 24-bit pixel.
    These formulas were invented by David Dalrymple to obtain maximum contrast without going
    out of gamut if the parameters are in the range 0-1.
    
    A saturation multiplier was added by Gregor Aisch
     */
    var c, h, l, ref;
    ref = unpack(arguments), l = ref[0], c = ref[1], h = ref[2];
    h = h * DEG2RAD;
    return [l, cos(h) * c, sin(h) * c];
  };

  lch2rgb = function() {
    var L, a, args, b, c, g, h, l, r, ref, ref1;
    args = unpack(arguments);
    l = args[0], c = args[1], h = args[2];
    ref = lch2lab(l, c, h), L = ref[0], a = ref[1], b = ref[2];
    ref1 = lab2rgb(L, a, b), r = ref1[0], g = ref1[1], b = ref1[2];
    return [limit(r, 0, 255), limit(g, 0, 255), limit(b, 0, 255), args.length > 3 ? args[3] : 1];
  };

  lab2lch = function() {
    var a, b, c, h, l, ref;
    ref = unpack(arguments), l = ref[0], a = ref[1], b = ref[2];
    c = sqrt(a * a + b * b);
    h = (atan2(b, a) * RAD2DEG + 360) % 360;
    if (round(c * 10000) === 0) {
      h = Number.NaN;
    }
    return [l, c, h];
  };

  rgb2lch = function() {
    var a, b, g, l, r, ref, ref1;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    ref1 = rgb2lab(r, g, b), l = ref1[0], a = ref1[1], b = ref1[2];
    return lab2lch(l, a, b);
  };

  chroma.lch = function() {
    var args;
    args = unpack(arguments);
    return new Color(args, 'lch');
  };

  chroma.hcl = function() {
    var args;
    args = unpack(arguments);
    return new Color(args, 'hcl');
  };

  _input.lch = lch2rgb;

  _input.hcl = function() {
    var c, h, l, ref;
    ref = unpack(arguments), h = ref[0], c = ref[1], l = ref[2];
    return lch2rgb([l, c, h]);
  };

  Color.prototype.lch = function() {
    return rgb2lch(this._rgb);
  };

  Color.prototype.hcl = function() {
    return rgb2lch(this._rgb).reverse();
  };

  rgb2cmyk = function(mode) {
    var b, c, f, g, k, m, r, ref, y;
    if (mode == null) {
      mode = 'rgb';
    }
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = r / 255;
    g = g / 255;
    b = b / 255;
    k = 1 - Math.max(r, Math.max(g, b));
    f = k < 1 ? 1 / (1 - k) : 0;
    c = (1 - r - k) * f;
    m = (1 - g - k) * f;
    y = (1 - b - k) * f;
    return [c, m, y, k];
  };

  cmyk2rgb = function() {
    var alpha, args, b, c, g, k, m, r, y;
    args = unpack(arguments);
    c = args[0], m = args[1], y = args[2], k = args[3];
    alpha = args.length > 4 ? args[4] : 1;
    if (k === 1) {
      return [0, 0, 0, alpha];
    }
    r = c >= 1 ? 0 : round(255 * (1 - c) * (1 - k));
    g = m >= 1 ? 0 : round(255 * (1 - m) * (1 - k));
    b = y >= 1 ? 0 : round(255 * (1 - y) * (1 - k));
    return [r, g, b, alpha];
  };

  _input.cmyk = function() {
    return cmyk2rgb(unpack(arguments));
  };

  chroma.cmyk = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['cmyk']), function(){});
  };

  Color.prototype.cmyk = function() {
    return rgb2cmyk(this._rgb);
  };

  _input.gl = function() {
    var i, k, o, rgb, v;
    rgb = (function() {
      var ref, results;
      ref = unpack(arguments);
      results = [];
      for (k in ref) {
        v = ref[k];
        results.push(v);
      }
      return results;
    }).apply(this, arguments);
    for (i = o = 0; o <= 2; i = ++o) {
      rgb[i] *= 255;
    }
    return rgb;
  };

  chroma.gl = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['gl']), function(){});
  };

  Color.prototype.gl = function() {
    var rgb;
    rgb = this._rgb;
    return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, rgb[3]];
  };

  rgb2luminance = function(r, g, b) {
    var ref;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    r = luminance_x(r);
    g = luminance_x(g);
    b = luminance_x(b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  luminance_x = function(x) {
    x /= 255;
    if (x <= 0.03928) {
      return x / 12.92;
    } else {
      return pow((x + 0.055) / 1.055, 2.4);
    }
  };

  _interpolators = [];

  interpolate = function(col1, col2, f, m) {
    var interpol, len, o, res;
    if (f == null) {
      f = 0.5;
    }
    if (m == null) {
      m = 'rgb';
    }

    /*
    interpolates between colors
    f = 0 --> me
    f = 1 --> col
     */
    if (type(col1) !== 'object') {
      col1 = chroma(col1);
    }
    if (type(col2) !== 'object') {
      col2 = chroma(col2);
    }
    for (o = 0, len = _interpolators.length; o < len; o++) {
      interpol = _interpolators[o];
      if (m === interpol[0]) {
        res = interpol[1](col1, col2, f, m);
        break;
      }
    }
    if (res == null) {
      throw "color mode " + m + " is not supported";
    }
    res.alpha(col1.alpha() + f * (col2.alpha() - col1.alpha()));
    return res;
  };

  chroma.interpolate = interpolate;

  Color.prototype.interpolate = function(col2, f, m) {
    return interpolate(this, col2, f, m);
  };

  chroma.mix = interpolate;

  Color.prototype.mix = Color.prototype.interpolate;

  interpolate_rgb = function(col1, col2, f, m) {
    var xyz0, xyz1;
    xyz0 = col1._rgb;
    xyz1 = col2._rgb;
    return new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
  };

  _interpolators.push(['rgb', interpolate_rgb]);

  Color.prototype.luminance = function(lum, mode) {
    var cur_lum, eps, max_iter, test;
    if (mode == null) {
      mode = 'rgb';
    }
    if (!arguments.length) {
      return rgb2luminance(this._rgb);
    }
    if (lum === 0) {
      this._rgb = [0, 0, 0, this._rgb[3]];
    } else if (lum === 1) {
      this._rgb = [255, 255, 255, this._rgb[3]];
    } else {
      eps = 1e-7;
      max_iter = 20;
      test = function(l, h) {
        var lm, m;
        m = l.interpolate(h, 0.5, mode);
        lm = m.luminance();
        if (Math.abs(lum - lm) < eps || !max_iter--) {
          return m;
        }
        if (lm > lum) {
          return test(l, m);
        }
        return test(m, h);
      };
      cur_lum = rgb2luminance(this._rgb);
      this._rgb = (cur_lum > lum ? test(chroma('black'), this) : test(this, chroma('white'))).rgba();
    }
    return this;
  };

  temperature2rgb = function(kelvin) {
    var b, g, r, temp;
    temp = kelvin / 100;
    if (temp < 66) {
      r = 255;
      g = -155.25485562709179 - 0.44596950469579133 * (g = temp - 2) + 104.49216199393888 * log(g);
      b = temp < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (b = temp - 10) + 115.67994401066147 * log(b);
    } else {
      r = 351.97690566805693 + 0.114206453784165 * (r = temp - 55) - 40.25366309332127 * log(r);
      g = 325.4494125711974 + 0.07943456536662342 * (g = temp - 50) - 28.0852963507957 * log(g);
      b = 255;
    }
    return clip_rgb([r, g, b]);
  };

  rgb2temperature = function() {
    var b, eps, g, maxTemp, minTemp, r, ref, rgb, temp;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    minTemp = 1000;
    maxTemp = 40000;
    eps = 0.4;
    while (maxTemp - minTemp > eps) {
      temp = (maxTemp + minTemp) * 0.5;
      rgb = temperature2rgb(temp);
      if ((rgb[2] / rgb[0]) >= (b / r)) {
        maxTemp = temp;
      } else {
        minTemp = temp;
      }
    }
    return round(temp);
  };

  chroma.temperature = chroma.kelvin = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['temperature']), function(){});
  };

  _input.temperature = _input.kelvin = _input.K = temperature2rgb;

  Color.prototype.temperature = function() {
    return rgb2temperature(this._rgb);
  };

  Color.prototype.kelvin = Color.prototype.temperature;

  chroma.contrast = function(a, b) {
    var l1, l2, ref, ref1;
    if ((ref = type(a)) === 'string' || ref === 'number') {
      a = new Color(a);
    }
    if ((ref1 = type(b)) === 'string' || ref1 === 'number') {
      b = new Color(b);
    }
    l1 = a.luminance();
    l2 = b.luminance();
    if (l1 > l2) {
      return (l1 + 0.05) / (l2 + 0.05);
    } else {
      return (l2 + 0.05) / (l1 + 0.05);
    }
  };

  Color.prototype.get = function(modechan) {
    var channel, i, me, mode, ref, src;
    me = this;
    ref = modechan.split('.'), mode = ref[0], channel = ref[1];
    src = me[mode]();
    if (channel) {
      i = mode.indexOf(channel);
      if (i > -1) {
        return src[i];
      } else {
        return console.warn('unknown channel ' + channel + ' in mode ' + mode);
      }
    } else {
      return src;
    }
  };

  Color.prototype.set = function(modechan, value) {
    var channel, i, me, mode, ref, src;
    me = this;
    ref = modechan.split('.'), mode = ref[0], channel = ref[1];
    if (channel) {
      src = me[mode]();
      i = mode.indexOf(channel);
      if (i > -1) {
        if (type(value) === 'string') {
          switch (value.charAt(0)) {
            case '+':
              src[i] += +value;
              break;
            case '-':
              src[i] += +value;
              break;
            case '*':
              src[i] *= +(value.substr(1));
              break;
            case '/':
              src[i] /= +(value.substr(1));
              break;
            default:
              src[i] = +value;
          }
        } else {
          src[i] = value;
        }
      } else {
        console.warn('unknown channel ' + channel + ' in mode ' + mode);
      }
    } else {
      src = value;
    }
    me._rgb = chroma(src, mode).alpha(me.alpha())._rgb;
    return me;
  };

  Color.prototype.darken = function(amount) {
    var lab, me;
    if (amount == null) {
      amount = 1;
    }
    me = this;
    lab = me.lab();
    lab[0] -= LAB_CONSTANTS.Kn * amount;
    return chroma.lab(lab).alpha(me.alpha());
  };

  Color.prototype.brighten = function(amount) {
    if (amount == null) {
      amount = 1;
    }
    return this.darken(-amount);
  };

  Color.prototype.darker = Color.prototype.darken;

  Color.prototype.brighter = Color.prototype.brighten;

  Color.prototype.saturate = function(amount) {
    var lch, me;
    if (amount == null) {
      amount = 1;
    }
    me = this;
    lch = me.lch();
    lch[1] += amount * LAB_CONSTANTS.Kn;
    if (lch[1] < 0) {
      lch[1] = 0;
    }
    return chroma.lch(lch).alpha(me.alpha());
  };

  Color.prototype.desaturate = function(amount) {
    if (amount == null) {
      amount = 1;
    }
    return this.saturate(-amount);
  };

  Color.prototype.premultiply = function() {
    var a, rgb;
    rgb = this.rgb();
    a = this.alpha();
    return chroma(rgb[0] * a, rgb[1] * a, rgb[2] * a, a);
  };

  blend = function(bottom, top, mode) {
    if (!blend[mode]) {
      throw 'unknown blend mode ' + mode;
    }
    return blend[mode](bottom, top);
  };

  blend_f = function(f) {
    return function(bottom, top) {
      var c0, c1;
      c0 = chroma(top).rgb();
      c1 = chroma(bottom).rgb();
      return chroma(f(c0, c1), 'rgb');
    };
  };

  each = function(f) {
    return function(c0, c1) {
      var i, o, out;
      out = [];
      for (i = o = 0; o <= 3; i = ++o) {
        out[i] = f(c0[i], c1[i]);
      }
      return out;
    };
  };

  normal = function(a, b) {
    return a;
  };

  multiply = function(a, b) {
    return a * b / 255;
  };

  darken = function(a, b) {
    if (a > b) {
      return b;
    } else {
      return a;
    }
  };

  lighten = function(a, b) {
    if (a > b) {
      return a;
    } else {
      return b;
    }
  };

  screen = function(a, b) {
    return 255 * (1 - (1 - a / 255) * (1 - b / 255));
  };

  overlay = function(a, b) {
    if (b < 128) {
      return 2 * a * b / 255;
    } else {
      return 255 * (1 - 2 * (1 - a / 255) * (1 - b / 255));
    }
  };

  burn = function(a, b) {
    return 255 * (1 - (1 - b / 255) / (a / 255));
  };

  dodge = function(a, b) {
    if (a === 255) {
      return 255;
    }
    a = 255 * (b / 255) / (1 - a / 255);
    if (a > 255) {
      return 255;
    } else {
      return a;
    }
  };

  blend.normal = blend_f(each(normal));

  blend.multiply = blend_f(each(multiply));

  blend.screen = blend_f(each(screen));

  blend.overlay = blend_f(each(overlay));

  blend.darken = blend_f(each(darken));

  blend.lighten = blend_f(each(lighten));

  blend.dodge = blend_f(each(dodge));

  blend.burn = blend_f(each(burn));

  chroma.blend = blend;

  chroma.analyze = function(data) {
    var len, o, r, val;
    r = {
      min: Number.MAX_VALUE,
      max: Number.MAX_VALUE * -1,
      sum: 0,
      values: [],
      count: 0
    };
    for (o = 0, len = data.length; o < len; o++) {
      val = data[o];
      if ((val != null) && !isNaN(val)) {
        r.values.push(val);
        r.sum += val;
        if (val < r.min) {
          r.min = val;
        }
        if (val > r.max) {
          r.max = val;
        }
        r.count += 1;
      }
    }
    r.domain = [r.min, r.max];
    r.limits = function(mode, num) {
      return chroma.limits(r, mode, num);
    };
    return r;
  };

  chroma.scale = function(colors, positions) {
    var _classes, _colorCache, _colors, _correctLightness, _domain, _fixed, _max, _min, _mode, _nacol, _out, _padding, _pos, _spread, classifyValue, f, getClass, getColor, resetCache, setColors, tmap;
    _mode = 'rgb';
    _nacol = chroma('#ccc');
    _spread = 0;
    _fixed = false;
    _domain = [0, 1];
    _pos = [];
    _padding = [0, 0];
    _classes = false;
    _colors = [];
    _out = false;
    _min = 0;
    _max = 1;
    _correctLightness = false;
    _colorCache = {};
    setColors = function(colors) {
      var c, col, o, ref, ref1, ref2, w;
      if (colors == null) {
        colors = ['#fff', '#000'];
      }
      if ((colors != null) && type(colors) === 'string' && (((ref = chroma.brewer) != null ? ref[colors] : void 0) != null)) {
        colors = chroma.brewer[colors];
      }
      if (type(colors) === 'array') {
        colors = colors.slice(0);
        for (c = o = 0, ref1 = colors.length - 1; 0 <= ref1 ? o <= ref1 : o >= ref1; c = 0 <= ref1 ? ++o : --o) {
          col = colors[c];
          if (type(col) === "string") {
            colors[c] = chroma(col);
          }
        }
        _pos.length = 0;
        for (c = w = 0, ref2 = colors.length - 1; 0 <= ref2 ? w <= ref2 : w >= ref2; c = 0 <= ref2 ? ++w : --w) {
          _pos.push(c / (colors.length - 1));
        }
      }
      resetCache();
      return _colors = colors;
    };
    getClass = function(value) {
      var i, n;
      if (_classes != null) {
        n = _classes.length - 1;
        i = 0;
        while (i < n && value >= _classes[i]) {
          i++;
        }
        return i - 1;
      }
      return 0;
    };
    tmap = function(t) {
      return t;
    };
    classifyValue = function(value) {
      var i, maxc, minc, n, val;
      val = value;
      if (_classes.length > 2) {
        n = _classes.length - 1;
        i = getClass(value);
        minc = _classes[0] + (_classes[1] - _classes[0]) * (0 + _spread * 0.5);
        maxc = _classes[n - 1] + (_classes[n] - _classes[n - 1]) * (1 - _spread * 0.5);
        val = _min + ((_classes[i] + (_classes[i + 1] - _classes[i]) * 0.5 - minc) / (maxc - minc)) * (_max - _min);
      }
      return val;
    };
    getColor = function(val, bypassMap) {
      var c, col, i, k, o, p, ref, t;
      if (bypassMap == null) {
        bypassMap = false;
      }
      if (isNaN(val)) {
        return _nacol;
      }
      if (!bypassMap) {
        if (_classes && _classes.length > 2) {
          c = getClass(val);
          t = c / (_classes.length - 2);
          t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));
        } else if (_max !== _min) {
          t = (val - _min) / (_max - _min);
          t = _padding[0] + (t * (1 - _padding[0] - _padding[1]));
          t = Math.min(1, Math.max(0, t));
        } else {
          t = 1;
        }
      } else {
        t = val;
      }
      if (!bypassMap) {
        t = tmap(t);
      }
      k = Math.floor(t * 10000);
      if (_colorCache[k]) {
        col = _colorCache[k];
      } else {
        if (type(_colors) === 'array') {
          for (i = o = 0, ref = _pos.length - 1; 0 <= ref ? o <= ref : o >= ref; i = 0 <= ref ? ++o : --o) {
            p = _pos[i];
            if (t <= p) {
              col = _colors[i];
              break;
            }
            if (t >= p && i === _pos.length - 1) {
              col = _colors[i];
              break;
            }
            if (t > p && t < _pos[i + 1]) {
              t = (t - p) / (_pos[i + 1] - p);
              col = chroma.interpolate(_colors[i], _colors[i + 1], t, _mode);
              break;
            }
          }
        } else if (type(_colors) === 'function') {
          col = _colors(t);
        }
        _colorCache[k] = col;
      }
      return col;
    };
    resetCache = function() {
      return _colorCache = {};
    };
    setColors(colors);
    f = function(v) {
      var c;
      c = chroma(getColor(v));
      if (_out && c[_out]) {
        return c[_out]();
      } else {
        return c;
      }
    };
    f.classes = function(classes) {
      var d;
      if (classes != null) {
        if (type(classes) === 'array') {
          _classes = classes;
          _domain = [classes[0], classes[classes.length - 1]];
        } else {
          d = chroma.analyze(_domain);
          if (classes === 0) {
            _classes = [d.min, d.max];
          } else {
            _classes = chroma.limits(d, 'e', classes);
          }
        }
        return f;
      }
      return _classes;
    };
    f.domain = function(domain) {
      var c, d, k, len, o, ref, w;
      if (!arguments.length) {
        return _domain;
      }
      _min = domain[0];
      _max = domain[domain.length - 1];
      _pos = [];
      k = _colors.length;
      if (domain.length === k && _min !== _max) {
        for (o = 0, len = domain.length; o < len; o++) {
          d = domain[o];
          _pos.push((d - _min) / (_max - _min));
        }
      } else {
        for (c = w = 0, ref = k - 1; 0 <= ref ? w <= ref : w >= ref; c = 0 <= ref ? ++w : --w) {
          _pos.push(c / (k - 1));
        }
      }
      _domain = [_min, _max];
      return f;
    };
    f.mode = function(_m) {
      if (!arguments.length) {
        return _mode;
      }
      _mode = _m;
      resetCache();
      return f;
    };
    f.range = function(colors, _pos) {
      setColors(colors, _pos);
      return f;
    };
    f.out = function(_o) {
      _out = _o;
      return f;
    };
    f.spread = function(val) {
      if (!arguments.length) {
        return _spread;
      }
      _spread = val;
      return f;
    };
    f.correctLightness = function(v) {
      if (v == null) {
        v = true;
      }
      _correctLightness = v;
      resetCache();
      if (_correctLightness) {
        tmap = function(t) {
          var L0, L1, L_actual, L_diff, L_ideal, max_iter, pol, t0, t1;
          L0 = getColor(0, true).lab()[0];
          L1 = getColor(1, true).lab()[0];
          pol = L0 > L1;
          L_actual = getColor(t, true).lab()[0];
          L_ideal = L0 + (L1 - L0) * t;
          L_diff = L_actual - L_ideal;
          t0 = 0;
          t1 = 1;
          max_iter = 20;
          while (Math.abs(L_diff) > 1e-2 && max_iter-- > 0) {
            (function() {
              if (pol) {
                L_diff *= -1;
              }
              if (L_diff < 0) {
                t0 = t;
                t += (t1 - t) * 0.5;
              } else {
                t1 = t;
                t += (t0 - t) * 0.5;
              }
              L_actual = getColor(t, true).lab()[0];
              return L_diff = L_actual - L_ideal;
            })();
          }
          return t;
        };
      } else {
        tmap = function(t) {
          return t;
        };
      }
      return f;
    };
    f.padding = function(p) {
      if (p != null) {
        if (type(p) === 'number') {
          p = [p, p];
        }
        _padding = p;
        return f;
      } else {
        return _padding;
      }
    };
    f.colors = function() {
      var dd, dm, i, numColors, o, out, ref, results, samples, w;
      numColors = 0;
      out = 'hex';
      if (arguments.length === 1) {
        if (type(arguments[0]) === 'string') {
          out = arguments[0];
        } else {
          numColors = arguments[0];
        }
      }
      if (arguments.length === 2) {
        numColors = arguments[0], out = arguments[1];
      }
      if (numColors) {
        dm = _domain[0];
        dd = _domain[1] - dm;
        return (function() {
          results = [];
          for (var o = 0; 0 <= numColors ? o < numColors : o > numColors; 0 <= numColors ? o++ : o--){ results.push(o); }
          return results;
        }).apply(this).map(function(i) {
          return f(dm + i / (numColors - 1) * dd)[out]();
        });
      }
      colors = [];
      samples = [];
      if (_classes && _classes.length > 2) {
        for (i = w = 1, ref = _classes.length; 1 <= ref ? w < ref : w > ref; i = 1 <= ref ? ++w : --w) {
          samples.push((_classes[i - 1] + _classes[i]) * 0.5);
        }
      } else {
        samples = _domain;
      }
      return samples.map(function(v) {
        return f(v)[out]();
      });
    };
    return f;
  };

  if (chroma.scales == null) {
    chroma.scales = {};
  }

  chroma.scales.cool = function() {
    return chroma.scale([chroma.hsl(180, 1, .9), chroma.hsl(250, .7, .4)]);
  };

  chroma.scales.hot = function() {
    return chroma.scale(['#000', '#f00', '#ff0', '#fff'], [0, .25, .75, 1]).mode('rgb');
  };

  chroma.analyze = function(data, key, filter) {
    var add, k, len, o, r, val, visit;
    r = {
      min: Number.MAX_VALUE,
      max: Number.MAX_VALUE * -1,
      sum: 0,
      values: [],
      count: 0
    };
    if (filter == null) {
      filter = function() {
        return true;
      };
    }
    add = function(val) {
      if ((val != null) && !isNaN(val)) {
        r.values.push(val);
        r.sum += val;
        if (val < r.min) {
          r.min = val;
        }
        if (val > r.max) {
          r.max = val;
        }
        r.count += 1;
      }
    };
    visit = function(val, k) {
      if (filter(val, k)) {
        if ((key != null) && type(key) === 'function') {
          return add(key(val));
        } else if ((key != null) && type(key) === 'string' || type(key) === 'number') {
          return add(val[key]);
        } else {
          return add(val);
        }
      }
    };
    if (type(data) === 'array') {
      for (o = 0, len = data.length; o < len; o++) {
        val = data[o];
        visit(val);
      }
    } else {
      for (k in data) {
        val = data[k];
        visit(val, k);
      }
    }
    r.domain = [r.min, r.max];
    r.limits = function(mode, num) {
      return chroma.limits(r, mode, num);
    };
    return r;
  };

  chroma.limits = function(data, mode, num) {
    var aa, ab, ac, ad, ae, af, ag, ah, ai, aj, ak, al, am, assignments, best, centroids, cluster, clusterSizes, dist, i, j, kClusters, limits, max_log, min, min_log, mindist, n, nb_iters, newCentroids, o, p, pb, pr, ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, repeat, sum, tmpKMeansBreaks, value, values, w;
    if (mode == null) {
      mode = 'equal';
    }
    if (num == null) {
      num = 7;
    }
    if (type(data) === 'array') {
      data = chroma.analyze(data);
    }
    min = data.min;
    max = data.max;
    sum = data.sum;
    values = data.values.sort(function(a, b) {
      return a - b;
    });
    limits = [];
    if (mode.substr(0, 1) === 'c') {
      limits.push(min);
      limits.push(max);
    }
    if (mode.substr(0, 1) === 'e') {
      limits.push(min);
      for (i = o = 1, ref = num - 1; 1 <= ref ? o <= ref : o >= ref; i = 1 <= ref ? ++o : --o) {
        limits.push(min + (i / num) * (max - min));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'l') {
      if (min <= 0) {
        throw 'Logarithmic scales are only possible for values > 0';
      }
      min_log = Math.LOG10E * log(min);
      max_log = Math.LOG10E * log(max);
      limits.push(min);
      for (i = w = 1, ref1 = num - 1; 1 <= ref1 ? w <= ref1 : w >= ref1; i = 1 <= ref1 ? ++w : --w) {
        limits.push(pow(10, min_log + (i / num) * (max_log - min_log)));
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'q') {
      limits.push(min);
      for (i = aa = 1, ref2 = num - 1; 1 <= ref2 ? aa <= ref2 : aa >= ref2; i = 1 <= ref2 ? ++aa : --aa) {
        p = values.length * i / num;
        pb = floor(p);
        if (pb === p) {
          limits.push(values[pb]);
        } else {
          pr = p - pb;
          limits.push(values[pb] * pr + values[pb + 1] * (1 - pr));
        }
      }
      limits.push(max);
    } else if (mode.substr(0, 1) === 'k') {

      /*
      implementation based on
      http://code.google.com/p/figue/source/browse/trunk/figue.js#336
      simplified for 1-d input values
       */
      n = values.length;
      assignments = new Array(n);
      clusterSizes = new Array(num);
      repeat = true;
      nb_iters = 0;
      centroids = null;
      centroids = [];
      centroids.push(min);
      for (i = ab = 1, ref3 = num - 1; 1 <= ref3 ? ab <= ref3 : ab >= ref3; i = 1 <= ref3 ? ++ab : --ab) {
        centroids.push(min + (i / num) * (max - min));
      }
      centroids.push(max);
      while (repeat) {
        for (j = ac = 0, ref4 = num - 1; 0 <= ref4 ? ac <= ref4 : ac >= ref4; j = 0 <= ref4 ? ++ac : --ac) {
          clusterSizes[j] = 0;
        }
        for (i = ad = 0, ref5 = n - 1; 0 <= ref5 ? ad <= ref5 : ad >= ref5; i = 0 <= ref5 ? ++ad : --ad) {
          value = values[i];
          mindist = Number.MAX_VALUE;
          for (j = ae = 0, ref6 = num - 1; 0 <= ref6 ? ae <= ref6 : ae >= ref6; j = 0 <= ref6 ? ++ae : --ae) {
            dist = abs(centroids[j] - value);
            if (dist < mindist) {
              mindist = dist;
              best = j;
            }
          }
          clusterSizes[best]++;
          assignments[i] = best;
        }
        newCentroids = new Array(num);
        for (j = af = 0, ref7 = num - 1; 0 <= ref7 ? af <= ref7 : af >= ref7; j = 0 <= ref7 ? ++af : --af) {
          newCentroids[j] = null;
        }
        for (i = ag = 0, ref8 = n - 1; 0 <= ref8 ? ag <= ref8 : ag >= ref8; i = 0 <= ref8 ? ++ag : --ag) {
          cluster = assignments[i];
          if (newCentroids[cluster] === null) {
            newCentroids[cluster] = values[i];
          } else {
            newCentroids[cluster] += values[i];
          }
        }
        for (j = ah = 0, ref9 = num - 1; 0 <= ref9 ? ah <= ref9 : ah >= ref9; j = 0 <= ref9 ? ++ah : --ah) {
          newCentroids[j] *= 1 / clusterSizes[j];
        }
        repeat = false;
        for (j = ai = 0, ref10 = num - 1; 0 <= ref10 ? ai <= ref10 : ai >= ref10; j = 0 <= ref10 ? ++ai : --ai) {
          if (newCentroids[j] !== centroids[i]) {
            repeat = true;
            break;
          }
        }
        centroids = newCentroids;
        nb_iters++;
        if (nb_iters > 200) {
          repeat = false;
        }
      }
      kClusters = {};
      for (j = aj = 0, ref11 = num - 1; 0 <= ref11 ? aj <= ref11 : aj >= ref11; j = 0 <= ref11 ? ++aj : --aj) {
        kClusters[j] = [];
      }
      for (i = ak = 0, ref12 = n - 1; 0 <= ref12 ? ak <= ref12 : ak >= ref12; i = 0 <= ref12 ? ++ak : --ak) {
        cluster = assignments[i];
        kClusters[cluster].push(values[i]);
      }
      tmpKMeansBreaks = [];
      for (j = al = 0, ref13 = num - 1; 0 <= ref13 ? al <= ref13 : al >= ref13; j = 0 <= ref13 ? ++al : --al) {
        tmpKMeansBreaks.push(kClusters[j][0]);
        tmpKMeansBreaks.push(kClusters[j][kClusters[j].length - 1]);
      }
      tmpKMeansBreaks = tmpKMeansBreaks.sort(function(a, b) {
        return a - b;
      });
      limits.push(tmpKMeansBreaks[0]);
      for (i = am = 1, ref14 = tmpKMeansBreaks.length - 1; am <= ref14; i = am += 2) {
        if (!isNaN(tmpKMeansBreaks[i])) {
          limits.push(tmpKMeansBreaks[i]);
        }
      }
    }
    return limits;
  };

  hsi2rgb = function(h, s, i) {

    /*
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/hsi2rgb.cpp
     */
    var args, b, g, r;
    args = unpack(arguments);
    h = args[0], s = args[1], i = args[2];
    h /= 360;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      g = 1 - (b + r);
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      b = 1 - (r + g);
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * cos(TWOPI * h) / cos(PITHIRD - TWOPI * h)) / 3;
      r = 1 - (g + b);
    }
    r = limit(i * r * 3);
    g = limit(i * g * 3);
    b = limit(i * b * 3);
    return [r * 255, g * 255, b * 255, args.length > 3 ? args[3] : 1];
  };

  rgb2hsi = function() {

    /*
    borrowed from here:
    http://hummer.stanford.edu/museinfo/doc/examples/humdrum/keyscape2/rgb2hsi.cpp
     */
    var b, g, h, i, min, r, ref, s;
    ref = unpack(arguments), r = ref[0], g = ref[1], b = ref[2];
    TWOPI = Math.PI * 2;
    r /= 255;
    g /= 255;
    b /= 255;
    min = Math.min(r, g, b);
    i = (r + g + b) / 3;
    s = 1 - min / i;
    if (s === 0) {
      h = 0;
    } else {
      h = ((r - g) + (r - b)) / 2;
      h /= Math.sqrt((r - g) * (r - g) + (r - b) * (g - b));
      h = Math.acos(h);
      if (b > g) {
        h = TWOPI - h;
      }
      h /= TWOPI;
    }
    return [h * 360, s, i];
  };

  chroma.hsi = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Color, slice.call(arguments).concat(['hsi']), function(){});
  };

  _input.hsi = hsi2rgb;

  Color.prototype.hsi = function() {
    return rgb2hsi(this._rgb);
  };

  interpolate_hsx = function(col1, col2, f, m) {
    var dh, hue, hue0, hue1, lbv, lbv0, lbv1, res, sat, sat0, sat1, xyz0, xyz1;
    if (m === 'hsl') {
      xyz0 = col1.hsl();
      xyz1 = col2.hsl();
    } else if (m === 'hsv') {
      xyz0 = col1.hsv();
      xyz1 = col2.hsv();
    } else if (m === 'hsi') {
      xyz0 = col1.hsi();
      xyz1 = col2.hsi();
    } else if (m === 'lch' || m === 'hcl') {
      m = 'hcl';
      xyz0 = col1.hcl();
      xyz1 = col2.hcl();
    }
    if (m.substr(0, 1) === 'h') {
      hue0 = xyz0[0], sat0 = xyz0[1], lbv0 = xyz0[2];
      hue1 = xyz1[0], sat1 = xyz1[1], lbv1 = xyz1[2];
    }
    if (!isNaN(hue0) && !isNaN(hue1)) {
      if (hue1 > hue0 && hue1 - hue0 > 180) {
        dh = hue1 - (hue0 + 360);
      } else if (hue1 < hue0 && hue0 - hue1 > 180) {
        dh = hue1 + 360 - hue0;
      } else {
        dh = hue1 - hue0;
      }
      hue = hue0 + f * dh;
    } else if (!isNaN(hue0)) {
      hue = hue0;
      if ((lbv1 === 1 || lbv1 === 0) && m !== 'hsv') {
        sat = sat0;
      }
    } else if (!isNaN(hue1)) {
      hue = hue1;
      if ((lbv0 === 1 || lbv0 === 0) && m !== 'hsv') {
        sat = sat1;
      }
    } else {
      hue = Number.NaN;
    }
    if (sat == null) {
      sat = sat0 + f * (sat1 - sat0);
    }
    lbv = lbv0 + f * (lbv1 - lbv0);
    return res = chroma[m](hue, sat, lbv);
  };

  _interpolators = _interpolators.concat((function() {
    var len, o, ref, results;
    ref = ['hsv', 'hsl', 'hsi', 'hcl', 'lch'];
    results = [];
    for (o = 0, len = ref.length; o < len; o++) {
      m = ref[o];
      results.push([m, interpolate_hsx]);
    }
    return results;
  })());

  interpolate_num = function(col1, col2, f, m) {
    var n1, n2;
    n1 = col1.num();
    n2 = col2.num();
    return chroma.num(n1 + (n2 - n1) * f, 'num');
  };

  _interpolators.push(['num', interpolate_num]);

  interpolate_lab = function(col1, col2, f, m) {
    var res, xyz0, xyz1;
    xyz0 = col1.lab();
    xyz1 = col2.lab();
    return res = new Color(xyz0[0] + f * (xyz1[0] - xyz0[0]), xyz0[1] + f * (xyz1[1] - xyz0[1]), xyz0[2] + f * (xyz1[2] - xyz0[2]), m);
  };

  _interpolators.push(['lab', interpolate_lab]);

}).call(this);

},{}],3:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],6:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":5,"_process":4,"inherits":3}],7:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This internal method tests if a name used for a {@link socioscapes} scape, state, layer, or extensions adheres to naming
 * restrictions.
 *
 * @function isValidName
 * @memberof socioscapes
 * @param {string} name - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
function isValidName(name) {
    var callback = newCallback(arguments),
        isValid = false,
        isReserved = [
            'help',
            // below are reserved JS words and properties
            'abstract',
            'arguments',
            'Array',
            'boolean',
            'break',
            'byte',
            'case',
            'catch',
            'char',
            'class',
            'const',
            'continue',
            'debugger',
            'Date',
            'default',
            'delete',
            'do',
            'double',
            'else',
            'enum',
            'eval',
            'export',
            'extends',
            'false',
            'final',
            'finally',
            'float',
            'for',
            'function',
            'goto',
            'hasOwnProperty',
            'if',
            'implements',
            'import',
            'in',
            'instanceof',
            'int',
            'interface',
            'isFinite',
            'isNaN',
            'isPrototypeOf',
            'Infinity',
            'length',
            'let',
            'long',
            'native',
            'Math',
            'name',
            'new',
            'NaN',
            'Number',
            'null',
            'Object',
            'package',
            'private',
            'protected',
            'prototype',
            'public',
            'return',
            'short',
            'static',
            'super',
            'switch',
            'synchronized',
            'String',
            'this',
            'throw',
            'throws',
            'toString',
            'transient',
            'true',
            'try',
            'typeof',
            'undefined',
            'valueOf',
            'var',
            'void',
            'volatile',
            'while',
            'with',
            'yield'
        ];
    if (name && typeof name === 'string') {
        if (/^[-A-Z0-9]+$/i.test(name)) {
            if (isReserved.indexOf(name) === -1) {
                isValid = true;
            } else {
                console.log('Sorry, "' + name + '" is not a valid name because it is a reserved word. The full list of reserved words is: ' + isReserved);
            }
        } else {
            console.log('Sorry, that is not a valid name. Valid names can only contain letters (a to Z), numbers (0-9), or dashes (-).');
        }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidName;
},{"./../construct/newCallback.js":10}],8:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');

/**
 * This internal method tests if an object adheres to the scape.sociJson standard.
 *
 * @function isValidObject
 * @memberof socioscapes
 * @param {Object} object - An object whose .meta.type === 'scape.sociJson'.
 * @returns {Boolean}
 */
function isValidObject(object) {
    var callback = newCallback(arguments),
        isValid = false;
    if (object && object.meta && object.meta.type && object.meta.type.indexOf('scape.sociJson') > -1) {
        isValid = true;
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidObject;
},{"./../construct/newCallback.js":10}],9:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This method tests the "URLiness" of a given string. It expects a string that fits the pattern
 * "protocol://my.valid.url/my.file" and supports the http, https, ftp, and ftps protocols.
 *
 * @function isValidUrl
 * @memberof socioscapes
 * @param {string} url - This should be a valid http, https, ftp, or ftps URL and follow the
 * "protocol://my.valid.url/my.file" pattern.
 * @returns {Boolean}
 */
function isValidUrl(url) {
    var callback = newCallback(arguments),
        isValid = false;
    if (url) {
            if (typeof url === 'string' && /^(http|HTTP|https|HTTPS|ftp|FTP|ftps|FTPS):\/\/(([a-zA-Z0-9$\-_.+!*'(),;:&=]|%[0-9a-fA-F]{2})+@)?(((25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])(\.(25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|[1-9][0-9]|[0-9])){3})|localhost|([a-zA-Z0-9\-\u00C0-\u017F]+\.)+([a-zA-Z]{2,}))(:[0-9]+)?(\/(([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*(\/([a-zA-Z0-9$\-_.+!*'(),;:@&=]|%[0-9a-fA-F]{2})*)*)?(\?([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$\-_.+!*'(),;:@&=\/?]|%[0-9a-fA-F]{2})*)?)?$/.test(url)) {
                isValid = true;
            }
    }
    callback(isValid);
    return isValid;
}
module.exports = isValidUrl;
},{"./../construct/newCallback.js":10}],10:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
/**
 * This internal method checks to see if the last argument in an array contains a function. If it does, return that
 * function, else return an empty function.
 *
 * @function newCallback
 * @memberof socioscapes
 * @param {Object[]} argumentsArray - The arguments array of a function.
 * @return {Function} myCallback - Any function.
 */
function newCallback(argumentsArray) {
    var myCallback;
    if (typeof argumentsArray[argumentsArray.length - 1] === 'function') {
       myCallback = argumentsArray[argumentsArray.length - 1];
    } else {
        myCallback = function(result) {
            return result;
        };
    }
    return myCallback;
}
module.exports = newCallback;
},{}],11:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newEvent = require('./../construct/newEvent.js');
/**
 * The {@link socioscapes} {@link Dispatcher} class helps to facilitate asynchronous method chaining and queues. Socioscapes
 * associates every 'scape' object with a unique dispatcher instance and id. The dispatcher allows for API calls to be
 * queued and synchronously resolved on a per-scape basis by attaching a unique dispatcher instance to every scape. The
 * api itself remains asynchronous. Calls to the dispatcher are expeted to provide an arguments array, myArguments, and
 * a function, myFunction. The first argument in myArguments should always be the object that myFunction modifes and/or
 * returns. myFunction is evaluated for the number of expected arguments (myFunction.length) and the dispatcher appends
 * null values for expected arguments that are missing. This is done so that a callback function can be appended to the
 * array and all functions that are executed through the dispatcher can safely assume that the element at index
 * myArguments.length is the dispatcher callback. Finally, a queue item consisting of the myFunction and myArguments
 * members is pushed into the dispatcher's queue array. The dispatcher works through each item in its queue by executing
 * myFunction(myArguments) and waiting for the callback function to fire an event that signals that the function has
 * returned a value and the dispatcher can safely move on to the next item its queue.
 *
 * @function newDispatcher
 * @memberof socioscapes
 * @return {Object}
 * */
function newDispatcher() {
    /**
     * Represents a {@link ScapeObject} dispatcher.
     * @namespace Dispatcher
     * @constructor
     */
    var Dispatcher = function() {
        var dispatcherId = new Date().getTime().toString() + Math.random().toString().split('.')[1], // unique ID,
            dispatcherQueue = [],
            dispatcherReady = true,
            queueItem,
            that = this;
        // add a unique event listener persistent to this dispatcher instance
        document.addEventListener("socioscapes.dispatched." + dispatcherId, function(event) {
            dispatcherReady = true;
            that.dispatch();
        });
        /**
         * Calls to the dispatcher are expeted to provide an arguments array, myArguments, and a function, myFunction.
         * The first argument in myArguments should always be the object that myFunction modifes and/or returns.
         * myFunction is evaluated for the number of expected arguments (myFunction.length) and the dispatcher appends
         * null values for expected arguments that are missing. This is done so that a callback function can be appended
         * to the array and all functions that are executed through the dispatcher can safely assume that the element at
         * index myArguments.length is the dispatcher callback. Finally, a queue item consisting of the myFunction and
         * myArguments members is pushed into the dispatcher's queue array.
         *
         * @memberof Dispatcher#
         * @function dispatch
         * @param {object} [config]
         * */
        Object.defineProperty(this, 'dispatch', {
            value: function (config) {
                if (config) {
                    config.myArguments.unshift(config.myContext);
                    for (; config.myFunction.length > config.myArguments.length; ) {
                        config.myArguments.push(null);
                    } // pack arguments array with null values if there are missing params so that the last param is always the dispatcher callback
                    config.myArguments.push(function(result) { // append the dispatcher callback to the arguments array
                        config.myCallback(result);
                        newEvent("socioscapes.dispatched." + dispatcherId, result);
                    }); // this event executes the callback and triggers the next item in the queue to be processed
                    dispatcherQueue.push({ // push the function and argument array to the dispatcher queue
                        "myArguments": config.myArguments,
                        "myFunction": config.myFunction
                    });
                }
                if (dispatcherReady && dispatcherQueue.length > 0) {
                    dispatcherReady = false;
                    queueItem = dispatcherQueue.shift();
                    queueItem.myFunction.apply(that, queueItem.myArguments);
                }
                return this;
            }
        });
        /**
         * Returns the id specific to this {@link Dispatcher} instance. Useful if you want to setup external listeners for
         * dispatcher events (which fire in the "socioscapes.dispatched.id" pattern).
         *
         * @memberof Dispatcher#
         * @function id
         * */
        Object.defineProperty(this, 'id', {
            value: function() {
                return dispatcherId;
            }
        });
        return this;
    };
    return new Dispatcher();
}
module.exports = newDispatcher;
},{"./../construct/newEvent.js":12}],12:[function(require,module,exports){
/*jslint node: true */
/*global module, require, document, window, event*/
'use strict';
/**
 * This internal method is a CustomEvent wrapper that fires an arbitrary event. Socioscapes methods use it to signal
 * updates. For more information on CustomEvent, see {@link https://developer.mozilla.org/en/docs/Web/API/CustomEvent}.
 *
 * @function newEvent
 * @memberof socioscapes
 * @param {String} name - The name of the new event (this is what your event handler will listen for).
 * @param {Object} message - The content of the event.detail.
 */
// CustomEvent Polyfill
(function () {
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();
function newEvent(name, message) {
    var myEvent;
    myEvent = new CustomEvent(name, {"detail": message});
    document.dispatchEvent(myEvent);
}
module.exports = newEvent;
},{}],13:[function(require,module,exports){
(function (global){
/*jslint node: true */
/*global global, module, require, window*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js');
/**
 * This internal method creates a new global object. *gasp*
 *
 * @function newGlobal
 * @memberof socioscapes
 * @param {string} name - A valid name JavaScript object name.
 * @param {Object} object - The global object, either window or global.
 * @param {Boolean} [overwrite] - If true, overwrite existing objects.
 * @return {Object} myGlobal - The newly-created global object.
 */
function newGlobal(name, object, overwrite) {
    var callback = newCallback(arguments),
        myGlobal;
    if (fetchGlobal(name)) {
        if (overwrite) {
            if (window) {
                window[name] = object;
                myGlobal = window[name];
            } else if (global) {
                global[name] = object;
                myGlobal = global[name];
            }
        }
    } else {
        if (window) {
            window[name] = object;
            myGlobal = window[name];
        } else if (global) {
            window[name] = object;
            myGlobal = window[name];
        }
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = newGlobal;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../construct/newCallback.js":10,"./../fetch/fetchGlobal.js":21}],14:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newEvent = require('./../construct/newEvent.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    newScapeObject = require('./../construct/newScapeObject.js');
/**
 * This method creates {@link ScapeMenu} objects, which are the api interfaces that developers interact with.
 *
 * @function newScapeMenu
 * @memberof socioscapes
 * @param {Object} scapeObject - A valid {@link ScapeObject}.
 * @param {Object} socioscapesPrototype - The {@link socioscapes} api prototype.
 * @return {Object} - A {@link socioscapes} {@link ScapeMenu} object.
 */
var newScapeMenu = function newScapeMenu(scapeObject, socioscapesPrototype) {
    var newChildMenu = function newChildMenu(thisMenu, myObject, mySchema, myChild) {
            var myChildIsArray = myChild.class.match(/\[(.*?)]/g) ? true : false,
                myChildClass = myChildIsArray ? /\[(.*?)]/g.exec(myChild.class)[1] : myChild.class,
                myChildSchema = myChildIsArray ? mySchema[myChildClass][0]:mySchema[myChildClass]; // child item datastructure
            if (myChildSchema.menu) { // if the datastructure defines a menu stub
                Object.defineProperty(thisMenu, myChildClass, { // "myChildClass" evaluates to a classname string (eg. 'state' or 'view' or 'config')
                    value: function (command, config, callback) {
                            var myArguments = [],
                                myCallback = ((typeof command === 'function') && !config && !callback) ? command // test to see if the first argument is the only one provided and a function. if it is, assume it's a callback
                                    : ((typeof config === 'function') && !callback) ? config // otherwise, if the second argument is a function and there's no third argument, assume it's a callback
                                    : ((typeof callback === 'function') ? callback : function() { }), // otherwise, if the third argument is a function, assume it's a callback or create an empty one
                                myContext = { // this object points to several important references
                                    "object": myObject[myChildClass], // this is the object that the menu calls will manipulate
                                    "schema": myChildSchema, // this is the datastructure of the above object
                                    "that": myObject // this is the parent object of the above object (to be used as the "this" return object to facilitate method chaining)
                                },
                                myCommand,
                                myFunction = myChildSchema.menu,
                                myReturn = thisMenu; // default return value (to facilitate method chaining in the api)
                        if (myChildSchema.menu.name === 'menuClass') { // if the object we need to create is of class 'menuClass' (which means it will be an api menu object)
                            myObject = myChildSchema.menu(myContext, command, config); // just generate it on the fly since it's not async
                            myReturn = newScapeMenu(myObject, socioscapesPrototype); // trigger the callback (so that method chaining works even for synchronous api calls)
                            myCallback(myReturn); // and set the return value to be the new api menu object
                        } else { // otherwise, it might produce an asynchronous call so queue to the dispatcher so it can be evaluated sequentially
                            if (command) { // setup the myArguments array for the dispatcher
                                myCommand = socioscapesPrototype[command] ||  // if command matches a full command name
                                    socioscapesPrototype.schema.alias[command] || // or an alias
                                    ((typeof command === 'function') ? command: false); // or if it's a function, then let it be equal to itself; otherwise, false
                                myArguments.push(myCommand); // if a command arg was provided, push it to the myArguments array
                                if (typeof config !== 'function') { // do the same for config
                                    myArguments.push(config);
                                }
                            }
                            myObject.dispatch({
                                "myArguments": myArguments,
                                "myCallback": myCallback,
                                "myContext": myContext,
                                "myFunction": myFunction
                            });
                        }
                        return myReturn;
                    }
                });
            }
        },
        /**
         * Represents a {@link ScapeMenu} (the actual api menu interface that users interact with).
         * @namespace ScapeMenu
         * @constructor
         * @param {Object} myObject - An object of type {@link ScapeObject}.
         */
        ScapeMenu = function(myObject) {
            var mySchema = myObject.schema,
                myClass = mySchema.class,
                myParent = mySchema.parent,
                myType = mySchema.type,
                thisMenu = this;
            /**
             * The schema definition of the {@link ScapeObject} that this {@link ScapeMenu} is linked to.
             *
             * @memberof ScapeMenu#
             * @member {Object} schema
             * */
            Object.defineProperty(this, 'schema', {
                value: myObject.schema
            });
            /**
             * The {@link ScapeObject} that this {@link ScapeMenu} is linked to.
             *
             * @memberof ScapeMenu#
             * @member {Object} this
             * */
            Object.defineProperty(this, 'this', {
                value: myObject
            });
            /**
             * The metadata of the {@link ScapeObject} that this {@link ScapeMenu} is linked to.
             *
             * @memberof ScapeMenu#
             * @member {Object} meta
             * */
            Object.defineProperty(this, 'meta', {
                value: myObject.meta
            });
            /**
             * Creates and returns a new object of this type (which is stored in the parent container).
             *
             * @memberof ScapeMenu#
             * @function new
             * */
            Object.defineProperty(this, 'new', {
                value: function (name) {
                    var myNew;
                    name = name || mySchema.name + myClass.length;
                    myNew = newScapeObject(name, myParent, myType);
                    return myNew ? new ScapeMenu(myNew) : thisMenu;
                }
            });
            for (var i = 0; i < mySchema.children.length; i++) {
                newChildMenu(this, myObject, mySchema, mySchema.children[i]);
            }
            newEvent('socioscapes.active', myObject.meta);
            return this;
        };
    if (isValidObject(scapeObject)) {
        return new ScapeMenu(scapeObject);
    }
};
module.exports = newScapeMenu;
},{"./../bool/isValidObject.js":8,"./../construct/newEvent.js":12,"./../construct/newScapeObject.js":15}],15:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchScapeSchema = require('./../fetch/fetchScapeSchema.js');
/**
 * This method creates socioscape {@link ScapeObject} objects.
 *
 * @function newScapeObject
 * @memberof socioscapes
 * @param {string} name - A valid JavaScript name.
 * @param {Object} parent - A valid {@link ScapeObject} or null.
 * @param {string} type - A valid scape.sociJson scape class.
 * @return {Object} - A socioscapes {@link ScapeObject} object.
 */
var newScapeObject = function newScapeObject(name, parent, type) {
    var callback = newCallback(arguments),
        schema = fetchScapeSchema(type),
        myObject = false,
        /**
         * Represents a {@link ScapeObject} (a json container for arbitrary geospatial data).
         * @namespace ScapeObject
         * @constructor
         * @param {string} myName - A valid name.
         * @param {?Object} myParent - The containing parent item or null if this is a top level {@link ScapeObject} (a scape).
         * @param {Object} mySchema - The {@link socioscapes} schema branch that describes this {@link ScapeObject}.
         */
        ScapeObject = function(myName, myParent, mySchema) {
            var myDispatch = (myParent && myParent.dispatch) ? myParent.dispatch:newDispatcher().dispatch;
            /**
             * Accesses {@link Dispatcher#dispatch}.
             *
             * @memberof ScapeObject#
             * @function dispatch
             * */
            Object.defineProperty(this, 'dispatch', {
                value: myDispatch
            });
            /**
             * The schema definition corressponding to this {@link ScapeObject}.
             *
             * @memberof ScapeObject#
             * @member {Object} schema
             * */
            Object.defineProperty(this, 'schema', {
                value: mySchema
            });
            /**
             * The parent {@link ScapeObject} item.
             *
             * @memberof ScapeObject#
             * @member {Object} parent
             * */
            Object.defineProperty(this.schema, 'parent', {
                value: myParent || false
            });
            /**
             * The array container within the parent {@link ScapeObject} item which stores other {@link ScapeObject}s of this type.
             *
             * @memberof ScapeObject#
             * @member {Object} container
             * */
            if (!this.schema.container) {
                Object.defineProperty(this.schema, 'container', {
                    value: myParent ? myParent[mySchema.class]:false
                });
            }
            /**
             * The metadata corresponding to this {@link ScapeObject}.
             *
             * @memberof ScapeObject#
             * @member {Object} meta
             * */
            Object.defineProperty(this, 'meta', {
                value: {},
                writeable: true,
                enumerable: true
            });
                Object.defineProperty(this.meta, 'author', {
                    value: '',
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'name', {
                    value: myName,
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'summary', {
                    value: '',
                    writeable: true,
                    enumerable: true
                });
                Object.defineProperty(this.meta, 'type', {
                    value: mySchema.type,
                    enumerable: true
                });
            // {@link ScapeObjects} are defined in the {@link socioscapes}.prototype.schema member and follow a json
            // format. each level of a scape object can have an arbitrary number of child elements and
            // {@link socioscapes} will produce the necessary data structure and corresponding menu items. the following
            // loop creates a member for each item in the current schema's '.children' array. the children array is
            // simply a list of names which correspond to members in the schema's data structure. this means that
            // extending {@link socioscapes} can simply be a matter of altering the '.schema' member and allowing the
            // api to do the rest. child entries in [brackets] denote arrays and are populated by instances of the
            // corresponding class. for example, if 'mySchema.children[i].class' is '[state]', then 'mySchema.state[0]'
            // will be created  as the datastructure prototype for all entries in 'this.state'. all such prototypes and
            // schema definitions are stored in the {@link socioscapes}.prototype.schema.
            for (var i = 0; i < mySchema.children.length; i++) {
                var myChildClass = mySchema.children[i].class, // child item class
                    myChildIsArray,
                    myChildName, // child item name
                    myChildSchema, // child item definition and datastructure
                    myChildValue; // child item default value
                if (myChildClass.match(/\[(.*?)]/g)) {
                    myChildClass = /\[(.*?)]/g.exec(myChildClass)[1];
                    myChildIsArray = true;
                }
                myChildSchema = myChildIsArray ? mySchema[myChildClass][0]:mySchema[myChildClass];
                myChildName = myChildSchema.name || myChildSchema.class;
                myChildValue = myChildSchema.value || [];
                if (!this[myChildClass]) {
                    Object.defineProperty(this, myChildClass, {
                        value: myChildValue,
                        enumerable: true,
                        writable: true
                    });
                }
                if  (myChildIsArray) {
                    this[myChildClass].push(new ScapeObject(myChildName, this, myChildSchema));
                }
            }
            newEvent('socioscapes.new.' + this.meta.type, this);
            return this;
        };
    parent = fetchScape(parent);
    if (name) {
        if (parent) {
            if (schema) {
                if (fetchFromScape(name, 'name', parent[schema.class])) {
                    console.log('Fetching existing scape object "' + name + '" of class "' + schema.class + '".');
                    myObject = fetchFromScape(name, 'name', parent[schema.class]);
                } else {
                    console.log('Adding a new ' + schema.class + ' called "' + name + '" to the "' + parent.meta.name + '" ' +  parent.schema.class + '.');
                    myObject = new ScapeObject(name, parent, schema);
                    parent[schema.class].push(myObject);
                }
            }
        } else {
            if (fetchScape(name)) {
                console.log('Fetching exisisting scape "' + name + '".');
                myObject = fetchScape(name);
            } else {
                if (!fetchGlobal(name)) {
                    console.log('Creating a new scape called "' + name + '".');
                    myObject = new ScapeObject(name, null, schema);
                    newGlobal(name, myObject);
                }
            }
        }
    }
    callback(myObject);
    return myObject;
};
module.exports = newScapeObject;

},{"./../construct/newCallback.js":10,"./../construct/newDispatcher.js":11,"./../construct/newEvent.js":12,"./../construct/newGlobal.js":13,"./../fetch/fetchFromScape.js":20,"./../fetch/fetchGlobal.js":21,"./../fetch/fetchScape.js":25,"./../fetch/fetchScapeSchema.js":26}],16:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var version = '0.7.0-2',
    chroma = require('chroma-js'),
    geostats = require('./../lib/geostats.min.js'),
    newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js'),
    newDispatcher = require('./../construct/newDispatcher.js'),
    fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newGlobal = require('./../construct/newGlobal.js'),
    isValidObject = require('./../bool/isValidObject.js'),
    isValidName = require('./../bool/isValidName.js'),
    isValidUrl = require('./../bool/isValidUrl.js'),
    fetchFromScape = require('./../fetch/fetchFromScape.js'),
    fetchScape = require('./../fetch/fetchScape.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    fetchGoogleGeocode = require('./../fetch/fetchGoogleGeocode.js'),
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    menuStore = require('./../menu/menuStore.js'),
    schema = require('./../core/schema.js'),
    fetchScapeSchema = require('./../fetch/fetchScapeSchema.js'),
    newScapeObject = require('./../construct/newScapeObject.js'),
    newScapeMenu = require('./../construct/newScapeMenu.js'),
    extender = require('./../core/extender');
/**
 * @global
 * @namespace
 * @param {string} [scapeName=scape0] - The name of an existing ScapeObject to load.
 * @return {Object} The {@link socioscapes} api interface, which is a {@link ScapeMenu} object.
 */
function socioscapes(scapeName) { // when socioscapes is called, fetch the {@link ScapeObject} specified (or fetch / create a default {@link ScapeObject}) and return an api ({@link ScapeMenu}) for it
    var myScape = scapeName ? fetchScape(scapeName) || newScapeObject(scapeName, null, 'scape')
                            : fetchScape('scape0') || newScapeObject('scape0', null, 'scape');
    return newScapeMenu(myScape, socioscapes.prototype);
}

// lets steal some structure from jQuery and setup socioscapes.prototype to act as a central methods repository, this way external socioscapes extensions will have access to internal socioscapes methods via the prototype
socioscapes.fn = socioscapes.prototype = {
    constructor: socioscapes,
    chroma: chroma,
    geostats: geostats,
    extender: extender,
    fetchFromScape: fetchFromScape,
    fetchGlobal: fetchGlobal,
    fetchGoogleAuth: fetchGoogleAuth,
    fetchGoogleBq: fetchGoogleBq,
    fetchGoogleGeocode: fetchGoogleGeocode,
    fetchScape: fetchScape,
    fetchScapeSchema: fetchScapeSchema,
    fetchWfs: fetchWfs,
    isValidName: isValidName,
    isValidObject: isValidObject,
    isValidUrl: isValidUrl,
    menuClass: menuClass,
    menuConfig: menuConfig,
    menuRequire: menuRequire,
    menuStore: menuStore,
    newCallback: newCallback,
    newDispatcher: newDispatcher,
    newEvent: newEvent,
    newGlobal: newGlobal,
    newScapeMenu: newScapeMenu,
    newScapeObject: newScapeObject,
    schema: schema,
    version: version
};
module.exports = socioscapes;
},{"./../bool/isValidName.js":7,"./../bool/isValidObject.js":8,"./../bool/isValidUrl.js":9,"./../construct/newCallback.js":10,"./../construct/newDispatcher.js":11,"./../construct/newEvent.js":12,"./../construct/newGlobal.js":13,"./../construct/newScapeMenu.js":14,"./../construct/newScapeObject.js":15,"./../core/extender":17,"./../core/schema.js":18,"./../fetch/fetchFromScape.js":20,"./../fetch/fetchGlobal.js":21,"./../fetch/fetchGoogleAuth.js":22,"./../fetch/fetchGoogleBq.js":23,"./../fetch/fetchGoogleGeocode.js":24,"./../fetch/fetchScape.js":25,"./../fetch/fetchScapeSchema.js":26,"./../fetch/fetchWfs.js":27,"./../lib/geostats.min.js":28,"./../menu/menuClass.js":30,"./../menu/menuConfig.js":31,"./../menu/menuRequire.js":32,"./../menu/menuStore.js":33,"chroma-js":2}],17:[function(require,module,exports){
/*jslint node: true */
/*global module, require, socioscapes, document, window, google, gapi*/
'use strict';
/**
 * The {@link socioscapes} structure is inspired by the jQuery team's module management system. To extend {@link socioscapes}, you
 * simply need to call {@link socioscapes}.extender and provide an array of entries that are composed of an object with
 * '.path' (a string), and '.extension' (a value) members.
 *
 * @function extender
 * @memberof socioscapes
 * @param {Object[]} config - A valid {@link socioscapes} extension configuration.
 * @param {string} config[].path - Tells the API where to store your extension. The path for most modules will be the
 * root path, which is {@link socioscapes}.fn. The name of your module should be prefixed such that existing elements can access
 * it. For instance, if you have created a new module that retrieves data from a MySql server, you'd want to use the
 * 'fetch' prefix (eg. 'fetchMysql').
 * @param {Function} socioscapes - The {@link socioscapes} api global object.
 * @param {string} config[].alias - A shorter alias that doesn't follow the above naming standards.
 * @param {Boolean} config[].silent - If true, supresses console.log messages.
 * @param {Object} config[].extension - Your extension.
 * */
function extender(socioscapes, config) {
    var myExtension, myName, myPath, i, ii,
        myTarget = socioscapes.prototype;
    for (i = 0; i < config.length; i++) {
        myPath = (typeof config[i].path === 'string') ? config[i].path:false;
        myExtension = config[i].extension || false;
        if (myPath && myExtension) {
            if (myPath.indexOf('/') > -1){
                myPath = myPath.split('/');
                for (ii = 0; myTarget[myPath[ii]] ; ii++) {
                    myTarget = myTarget[myPath[ii]];
                }
                myName = myPath[ii];
            } else {
                myName = myPath;
            }
            if (myTarget) {
                myTarget[myName] = myExtension;
                myTarget[myName].prototype = socioscapes.prototype;
                if (config[i].alias) {
                    myTarget.schema.alias[config[i].alias] = myTarget[myName];
                }
                if (!config[i].silent) {
                    console.log('Extended socioscapes.fn with "' + myPath + (config[i].alias ? ('" alias "' + config[i].alias + '".'):('".')));
                }
            } else {
                console.log('Sorry, unable to add your extension. Please check the .path string.');
            }
        }
    }
}
module.exports = extender;
},{}],18:[function(require,module,exports){
/*jslint node: true */
/*global module, require, this*/
'use strict';
var myVersion = '0.1',
    fetchGoogleBq = require('./../fetch/fetchGoogleBq.js'),
    fetchWfs = require('./../fetch/fetchWfs.js'),
    menuClass = require('./../menu/menuClass.js'),
    menuConfig = require('./../menu/menuConfig.js'),
    menuRequire = require('./../menu/menuRequire.js'),
    menuStore = require('./../menu/menuStore.js'),
    myScapeSchema = {
        "scape": {
        "children": [
            {
                "class": "[state]"
            }
        ],
        "class": "scape",
        "menu": menuClass,
        "name": "scape0",
        "state": [
            {
                "class": "state",
                "children": [
                    {
                        "class": "[layer]"
                    },
                    {
                        "class": "[view]"
                    }
                ],
                "layer": [
                    {
                        "children": [
                            {
                                "class": "data"
                            },
                            {
                                "class": "geom"
                            }
                        ],
                        "class": "layer",
                        "data": {
                            "menu": menuStore,
                            "value": {}
                        },
                        "geom": {
                            "menu": menuStore,
                            "value": {}
                        },
                        "menu": menuClass,
                        "name": "layer0",
                        "parent": "state",
                        "type": "layer.state.scape.sociJson"
                    }
                ],
                "menu": menuClass,
                "name": "state0",
                "parent": "scape",
                "type": "state.scape.sociJson",
                "view": [
                    {
                        "config": {
                            "menu": menuConfig,
                            "value": {
                                "breaks": 5, // number of groups the data should be classified into
                                "classification": "jenks", // the classification formula to use for geostats
                                "classes": [], // class cut-off values based on the classifictaion formula and number of breaks
                                "colourScale": "YlOrRd", // the colorbrew colorscale to use for chroma
                                "featureIdProperty": "dauid", // the feature's unique id, used to match geometery features with corresponding data values
                                "layer": 0, // the name or array id to fetch data and geometry from
                                "type": "", // the type of view
                                "valueIdProperty": "total", // the primary property to use when visualizing data
                                "version": myVersion
                            }
                        },
                        "children": [
                            {
                                "class": "config"
                            },
                            {
                                "class": "require"
                            }
                        ],
                        "class": "view",
                        "menu": menuClass,
                        "name": "view0",
                        "parent": "state",
                        "require": {
                            "menu": menuRequire,
                            "value": {
                                "layers": {}, // a list of layer's in the state's layer array that store values for this view
                                "modules": {} // a list of modules required for this view
                            }
                        },
                        "type": "view.state.scape.sociJson"
                    }
                ]
            }
        ],
        "type": "scape.sociJson"
    }
    },
    myScapeSchemaAlias = {
        "bq": fetchGoogleBq,
        "wfs": fetchWfs
    },
    myScapeSchemaIndex = {
        "scape": {
            "class": "scape", "type": "scape.sociJson", "schema": myScapeSchema.scape
        },
        "state": {
            "class": "state", "type": "state.scape.sociJson", "schema": myScapeSchema.scape.state[0]
        },
        "layer": {
            "class": "layer", "type": "layer.state.scape.sociJson" , "schema": myScapeSchema.scape.state[0].layer[0]
        },
        "view": {
            "class": "view", "type": "view.state.scape.sociJson", "schema": myScapeSchema.scape.state[0].view[0]
        }
    };
/**
 * This method creates socioscape schema objects.
 *
 * @memberof socioscapes
 * @return {Object} - A {@link socioscapes} schema object.
 */
function schema() {
    return {
        "structure": myScapeSchema,
        "alias" : myScapeSchemaAlias,
        "index" : myScapeSchemaIndex
    };
}
module.exports = schema();
},{"./../fetch/fetchGoogleBq.js":23,"./../fetch/fetchWfs.js":27,"./../menu/menuClass.js":30,"./../menu/menuConfig.js":31,"./../menu/menuRequire.js":32,"./../menu/menuStore.js":33}],19:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google, event, feature, gapi*/
'use strict';
function viewGmaps(socioscapes) {
    if (socioscapes && socioscapes.fn && socioscapes.fn.extender) {
        socioscapes.fn.extender(socioscapes, [
            {   path: 'viewGmapSymbology',
                alias: 'gsymbology',
                silent: true,
                extension:
                    function viewGmapSymbology(view) {
                        var chroma = viewGmapSymbology.prototype.chroma,
                            isValidObject = viewGmapSymbology.prototype.isValidObject,
                            fetchFromScape = viewGmapSymbology.prototype.fetchFromScape,
                            newCallback = viewGmapSymbology.prototype.newCallback,
                            newEvent = viewGmapSymbology.prototype.newEvent;
                        //
                        var callback = newCallback(arguments),
                            layer,
                            GmapLayer = function(view) {
                                var idValue,
                                    listenerClick,
                                    listenerHoverSet,
                                    listenerHoverReset,
                                    that = this;
                                if (view && view.config && view.config.gmap) {
                                    view.config.gmap.styles = view.config.gmap.styles || {};
                                    view.config.gmap.styles.default = view.config.gmap.styles.default ||  {
                                            fillOpacity: 0.75,
                                            fillColor: "purple",
                                            strokeOpacity: 0.75,
                                            strokeColor: "black",
                                            strokeWeight: 1,
                                            zIndex: 5,
                                            visible: true,
                                            clickable: true
                                        };
                                    view.config.gmap.styles.hover  = view.config.gmap.styles.hover ||  {
                                            fillOpacity: 0.75,
                                            fillColor: "purple",
                                            strokeOpacity: 1,
                                            strokeColor: "black",
                                            strokeWeight: 2,
                                            zIndex: 10,
                                            visible: true,
                                            clickable: true
                                        };
                                    view.config.gmap.styles.click  = view.config.gmap.styles.click || {
                                            fillOpacity: 1,
                                            fillColor: "purple",
                                            strokeOpacity: 1,
                                            strokeColor: "black",
                                            strokeWeight: 3,
                                            zIndex: 15,
                                            visible: true,
                                            clickable: true
                                        };
                                    view.config.features = {
                                        "selected": {},
                                        "selectedCount": 0,
                                        "selectedLimit": 0
                                    };
                                    this.dataLayer = new google.maps.Data();
                                    Object.defineProperty(this, 'init', {
                                        value: function () {
                                            var callback = newCallback(arguments),
                                                layer = fetchFromScape(view.config.layer, 'name', view.schema.parent.layer) || false,
                                                data = layer ? layer.data:false,
                                                geom = layer ? layer.geom:false,
                                                featureIdProperty = (typeof view.config.featureIdProperty === 'string') ? view.config.featureIdProperty.toLowerCase():'dauid',
                                                valueIdProperty = (typeof view.config.valueIdProperty === 'string') ? view.config.valueIdProperty.toLowerCase():'total';
                                            if (data && geom && featureIdProperty && valueIdProperty) {
                                                // remove the layer's existing features
                                                that.dataLayer.forEach(function(feature) {
                                                    that.dataLayer.remove(feature);
                                                });
                                                // load features from the layer's geom store
                                                that.dataLayer.addGeoJson(geom.geoJson, {featureIdProperty: featureIdProperty});
                                                if (data.geoJson.features[0].properties[valueIdProperty] !== undefined) {
                                                    // join those features with the layer's data store
                                                    that.dataLayer.forEach(function(feature) {
                                                        // [this feature's value]  =  [the   matching   data   object's]    [value field]  (if it exists)
                                                        if (data.byId[feature.getProperty(featureIdProperty)][valueIdProperty]) {
                                                            feature.setProperty(valueIdProperty, data.byId[feature.getProperty(featureIdProperty)][valueIdProperty]);
                                                        }
                                                    });
                                                    that.classify(function() {
                                                        that.style(function() {
                                                            that.onHover();
                                                            that.onClick(5);
                                                            callback(that);
                                                        });
                                                    });
                                                } else {
                                                    console.log('Sorry, that layer does not contain matching data for the geometry.');
                                                }
                                            } else {
                                                console.log('Sorry, there was a problem with your ".config" options. Did you you set a valid layer? Does your layer have data and geometry? Do the property names in your data and geometry correspond to the "featureIdProperty" and "valueIdProperty" fields?');
                                            }
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'classify', {
                                        value: function () {
                                            var callback = newCallback(arguments),
                                                layer = isValidObject(view) ? fetchFromScape(view.config.layer, 'name', view.schema.parent.layer):false,
                                                data = layer ? layer.data:false,
                                                classification = 'getClass' + view.config.classification.charAt(0).toUpperCase() + view.config.classification.slice(1),
                                                breaks = parseInt(view.config.breaks);
                                            if (data) {
                                                that.off();
                                                view.config.classes = layer.data.geostats[classification](breaks);
                                                that.on();
                                                callback(that);
                                            }
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'style', {
                                        value: function () {
                                            var callback = newCallback(arguments),
                                                myFillScale,
                                                valueProperty,
                                                exportType,
                                                exportOptions;
                                            that.dataLayer.setStyle(function (feature) {
                                                myFillScale = chroma.scale(view.config.colourScale).mode('lab').classes(view.config.classes).out('hex');
                                                valueProperty = feature.getProperty(view.config.valueIdProperty);
                                                exportType = feature.getProperty('hover') ? 'hover' : (feature.getProperty('selected') ? "click" : "default");
                                                exportOptions = {
                                                    fillOpacity: view.config.gmap.styles[exportType].fillOpacity,
                                                    fillColor: myFillScale(valueProperty) || view.config.gmap.styles[exportType].fillColor,
                                                    strokeOpacity: view.config.gmap.styles[exportType].strokeOpacity,
                                                    strokeColor: chroma(myFillScale(valueProperty)).darken(1) || view.config.gmap.styles[exportType].strokeColor,
                                                    strokeWeight: view.config.gmap.styles[exportType].strokeWeight,
                                                    zIndex: view.config.gmap.styles[exportType].zIndex,
                                                    visible: view.config.gmap.styles[exportType].visible,
                                                    clickable: view.config.gmap.styles[exportType].clickable
                                                };
                                                return /** @type {google.maps.Data.StyleOptions} */(exportOptions);
                                            });
                                            callback(that);
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'on', {
                                        value: function () {
                                            var callback = newCallback(arguments);
                                            that.dataLayer.setMap(view.gmap.mapBase);
                                            callback(that);
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'off', {
                                        value: function () {
                                            var callback = newCallback(arguments);
                                            that.dataLayer.setMap(null);
                                            callback(that);
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'onHover', {
                                        value: function (callback) {
                                            callback = newCallback(arguments);
                                            if (listenerHoverSet) {
                                                listenerHoverSet.remove();
                                                listenerHoverReset.remove();
                                            }
                                            listenerHoverSet = that.dataLayer.addListener('mouseover', function (event) {
                                                if (!event.feature.getProperty('selected')) {
                                                    event.feature.setProperty('hover', true);
                                                }
                                                newEvent('socioscapes.update.featureHover',
                                                    {
                                                        id: event.feature.getProperty(view.config.featureIdProperty),
                                                        value: event.feature.getProperty(view.config.valueIdProperty)
                                                    });
                                                callback(event.feature);
                                            });
                                            listenerHoverReset = that.dataLayer.addListener('mouseout', function (event) {
                                                event.feature.setProperty('hover', false);
                                                newEvent('socioscapes.update.featureHover', { id: '', value: '' });
                                                callback(event.feature);
                                            });
                                            return that;
                                        }
                                    });
                                    Object.defineProperty(this, 'onClick', {
                                        value: function (limit, callback) {
                                            callback = newCallback(arguments);
                                            // Check for existing listener, remove it, reset previously altered features
                                            if (listenerClick) {
                                                listenerClick.remove();
                                                for (var prop in view.config.features.selected) {
                                                    if (view.config.features.selected.hasOwnProperty(prop)) {
                                                        view.config.features.selected[prop].setProperty('selected', false);
                                                        delete view.config.features.selected[prop];
                                                    }
                                                }
                                            }
                                            view.config.features.selectedLimit = Number.isInteger(limit) ? limit : 0;
                                            view.config.features.selectedCount = 0;
                                            listenerClick = that.dataLayer.addListener('click', function (event) {
                                                idValue = event.feature.getProperty(view.config.featureIdProperty);
                                                if (event.feature.getProperty('selected')) {
                                                    event.feature.setProperty('selected', false);
                                                    view.config.features.selectedCount = view.config.features.selectedLimit ? Math.max(view.config.features.selectedCount - 1, 0) : view.config.features.selectedCount;
                                                    delete view.config.features.selected[idValue];
                                                    callback(event.feature, false);
                                                } else {
                                                    if (view.config.features.selectedLimit ? (view.config.features.selectedLimit > view.config.features.selectedCount) : true) {
                                                        event.feature.setProperty('selected', true);
                                                        view.config.features.selectedCount = (view.config.features.selectedLimit > view.config.features.selectedCount) ? view.config.features.selectedCount + 1 : view.config.features.selectedCount;
                                                        view.config.features.selected[idValue] = event.feature;
                                                    }
                                                    callback(event.feature, true);
                                                }
                                            });
                                            return that;
                                        }
                                    });
                                    return this;
                                }
                            };
                        // check to see that this is a view and that the view.config options point to a valid layer
                        view = socioscapes.fn.isValidObject(view) ? view:(this || false);
                        layer = (view && view.schema && view.config) ? fetchFromScape(view.config.layer, 'name', view.schema.parent.layer):false;
                        if (layer) {
                            view.gmap.mapSymbology = new GmapLayer(view);
                            callback(view);
                        } else {
                            callback(false);
                        }
                        return view;
                    }
            }]);
        socioscapes.fn.extender(socioscapes, [
            {
                path: 'viewGmapLabels',
                alias: 'glabel',
                silent: true,
                extension:
                    function viewGmapLabels(view) {
                        var isValidObject = viewGmapLabels.prototype.isValidObject,
                            newCallback = viewGmapLabels.prototype.newCallback;
                        //
                        var callback = newCallback(arguments),
                            dom,
                            layerHack;
                        if (isValidObject(view)) {
                            view.config.gmap.styles = view.config.gmap.styles || {};
                            view.config.gmap.styles.mapLabels = view.config.gmap.styles.mapLabels || [
                                    {
                                        "elementType": "all",
                                        "stylers": [
                                            { "visibility": "off" }
                                        ]
                                    },{
                                        "featureType": "administrative",
                                        "elementType": "labels.text.fill",
                                        "stylers": [
                                            {
                                                "visibility": "on"
                                            },
                                            {
                                                "color": "#ffffff"
                                            }
                                        ]
                                    },{
                                        "featureType": "administrative",
                                        "elementType": "labels.text.stroke",
                                        "stylers": [
                                            {
                                                "visibility": "on"
                                            },
                                            {
                                                "color": "#000000"
                                            },
                                            {
                                                "lightness": 13
                                                //"weight": 5
                                            }
                                        ]
                                    }
                                ];
                            // Create a custom OverlayView class and declare rules that will ensure it appears above all other map content
                            layerHack = new google.maps.OverlayView();
                            layerHack.onAdd = function () {
                                dom = this.getPanes();
                                dom.mapPane.style.zIndex = 150;
                            };
                            layerHack.onRemove = function () {
                                this.div_.parentNode.removeChild(this.div_);
                                this.div_ = null;
                            };
                            layerHack.draw = function () {
                            };
                            if (view.gmap.mapBase) {
                                layerHack.setMap(view.gmap.mapBase);
                                view.gmap.mapLabels = new google.maps.StyledMapType(view.config.gmap.styles.mapLabels);
                                view.gmap.mapBase.overlayMapTypes.insertAt(0, view.gmap.mapLabels);
                                view.gmap.mapLabels.layerHack = layerHack;
                                callback(view);
                            } else {
                                callback(false);
                            }
                        } else {
                            callback(false);
                        }
                        return view;
                    }
            }]);
        socioscapes.fn.extender(socioscapes, [
            {
                "path": 'viewGmapMap',
                "alias": 'gmap',
                "silent": true,
                extension:
                    function viewGmapMap(view) {
                        var isValidObject = viewGmapMap.prototype.isValidObject,
                            fetchGoogleGeocode = viewGmapMap.prototype.fetchGoogleGeocode,
                            newCallback = viewGmapMap.prototype.newCallback;
                        var callback = newCallback(arguments),
                            myDiv;
                        if (isValidObject(view)) {
                            view.gmap = view.gmap || {};
                            view.config.address = view.config.address || 'Toronto, Canada';
                            view.config.gmap = view.config.gmap || {};
                            view.config.gmap.div = view.config.gmap.div || 'map-canvas';
                            view.config.gmap.styles = view.config.gmap.styles || {};
                            view.config.gmap.styles.map = view.config.gmap.styles.map || [
                                    {
                                        "featureType": "all",
                                        "elementType": "labels.text",
                                        "stylers": [
                                            {
                                                "visibility": "off"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "landscape",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "visibility": "on"
                                            },
                                            {
                                                "saturation": -100
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "poi",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "visibility": "on"
                                            },
                                            {
                                                "color": "#dadada"
                                            },
                                            {
                                                "saturation": -100
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "poi",
                                        "elementType": "labels.icon",
                                        "stylers": [
                                            {
                                                "visibility": "off"
                                            },
                                            {
                                                "saturation": -100
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "transit.line",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "color": "#ffffff"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "transit.line",
                                        "elementType": "geometry.stroke",
                                        "stylers": [
                                            {
                                                "color": "#dbdbdb"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "road.highway",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "color": "#ffffff"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "road.highway",
                                        "elementType": "geometry.stroke",
                                        "stylers": [
                                            {
                                                "color": "#dbdbdb"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "road.arterial",
                                        "elementType": "geometry.stroke",
                                        "stylers": [
                                            {
                                                "color": "#d7d7d7"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "road.local",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "color": "#ffffff"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "road.local",
                                        "elementType": "geometry.stroke",
                                        "stylers": [
                                            {
                                                "color": "#d7d7d7"
                                            },
                                            {
                                                "saturation": -100
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "transit.station",
                                        "elementType": "labels.icon",
                                        "stylers": [
                                            {
                                                "hue": "#5e5791"
                                            }
                                        ]
                                    },
                                    {
                                        "featureType": "water",
                                        "elementType": "geometry.fill",
                                        "stylers": [
                                            {
                                                "hue": "#0032ff"
                                            },
                                            {
                                                "gamma": "0.45"
                                            }
                                        ]
                                    }
                                ];
                            myDiv = document.getElementById(view.config.gmap.div);
                            if (myDiv) {
                                fetchGoogleGeocode(view.config.address, function(geocodeResult) {
                                    if (geocodeResult) {
                                        view.config.gmap.geocode = geocodeResult;
                                        view.config.gmap.options = view.config.gmap.options || {
                                                "zoom": 13,
                                                "center": geocodeResult,
                                                "mapTypeId": google.maps.MapTypeId.ROADMAP,
                                                "mapTypeControl": true,
                                                "mapTypeControlOptions": {
                                                    "mapTypeIds": [
                                                        google.maps.MapTypeId.ROADMAP,
                                                        google.maps.MapTypeId.SATELLITE,
                                                        google.maps.MapTypeId.TERRAIN,
                                                        google.maps.MapTypeId.HYBRID
                                                    ],
                                                    "style": google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                                                    "position":google.maps.ControlPosition.TOP_RIGHT
                                                },
                                                disableDefaultUI: true,
                                                addressControlOptions: {
                                                    position: google.maps.ControlPosition.BOTTOM_CENTER
                                                },
                                                "overviewMapControl": true,
                                                "overviewMapControlOptions": {
                                                    "position": google.maps.ControlPosition.BOTTOM_LEFT
                                                },
                                                "zoomControl": true,
                                                "zoomControlOptions": {
                                                    "position": google.maps.ControlPosition.LEFT_CENTER,
                                                    "style": google.maps.ZoomControlStyle.LARGE
                                                },
                                                "streetViewControl": true,
                                                "streetViewControlOptions": {
                                                    "position": google.maps.ControlPosition.LEFT_CENTER
                                                },
                                                "panControl": false,
                                                "panControlOptions": {
                                                    "position": google.maps.ControlPosition.RIGHT_CENTER
                                                },
                                                "scaleControl": true,
                                                "scaleControlOptions": {
                                                    "position": google.maps.ControlPosition.BOTTOM_CENTER
                                                }
                                            };
                                        view.config.gmap.options.styles = view.config.gmap.styles.map;
                                        view.gmap.mapBase = new google.maps.Map(myDiv, view.config.gmap.options);
                                        google.maps.event.addListenerOnce(view.gmap.mapBase, 'idle', function() { // one time listener to make sure we don't trigger callback before map is ready
                                            view.gmap.mapBase.setTilt(45);
                                            callback(view);
                                        });
                                    } else {
                                        callback(false);
                                    }
                                });
                            } else {
                                console.log('Sorry, unable to located the view\'s config.gmap.div element.');
                                callback(false);
                            }
                        }
                        return view;
                    }
            }]);
        socioscapes.fn.extender(socioscapes, [
            {   path: 'viewGmapView',
                alias: 'gview',
                silent: true,
                extension:
                    function viewGmap(context, config) {
                        var isValidObject = viewGmap.prototype.isValidObject,
                            newCallback = viewGmap.prototype.newCallback;
                        //
                        var callback = newCallback(arguments),
                            gmap = viewGmap.prototype.viewGmapMap,
                            glabel = viewGmap.prototype.viewGmapLabels,
                            gsymbology = viewGmap.prototype.viewGmapSymbology,
                            view = context;
                        if (isValidObject(view)) {
                            if (!view.gmap) {
                                gmap(view, function(mapResult) {
                                    if (mapResult) {
                                        glabel(view, function(labelResult) {
                                            if (labelResult) {
                                                gsymbology(view, function(symbologyResult) {
                                                    if (symbologyResult) {
                                                        view.gmap.mapSymbology.init(function(initResult) {
                                                            if (initResult) {
                                                                view.gmap.mapSymbology.on();
                                                                callback(view);
                                                            } else {
                                                                callback(false);
                                                            }
                                                        });
                                                    } else {
                                                        callback(false);
                                                    }
                                                });
                                            } else {
                                                callback(false);
                                            }
                                        });
                                    } else {
                                        callback(false);
                                    }
                                });
                            } else {
                                if (!view.gmap.mapLabels) {
                                    glabel(view, function(labelResult) {
                                        if (labelResult) {
                                            gsymbology(view, function(symbologyResult) {
                                                if (symbologyResult) {
                                                    view.gmap.mapSymbology.init(function(initResult) {
                                                        if (initResult) {
                                                            view.gmap.mapSymbology.on();
                                                            callback(view);
                                                        } else {
                                                            callback(false);
                                                        }
                                                    });
                                                } else {
                                                    callback(false);
                                                }
                                            });
                                        }  else {
                                            callback(false);
                                        }
                                    });
                                } else {
                                    gsymbology(view, function(symbologyResult) {
                                        if (symbologyResult) {
                                            view.gmap.mapSymbology.init(function(initResult) {
                                                if (initResult) {
                                                    view.gmap.mapSymbology.on();
                                                    callback(view);
                                                } else {
                                                    callback(false);
                                                }
                                            });
                                        } else {
                                            callback(false);
                                        }
                                    });
                                }
                            }
                        } else {
                            callback(false);
                        }
                        return view;
                    }
            }]);
    }
}
module.exports = viewGmaps;
},{}],20:[function(require,module,exports){
/*jslint node: true */
/*global module, require, Number*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    isValidName = require('./../bool/isValidName.js');
/**
 * This internal method is used to extract a specific state, view, or layer from within a {@link ScapeObject} 'array' based on a
 * 'key' and 'metaProperty' pairing.
 *
 * @function fetchFromScape
 * @memberof socioscapes
 * @param {(number|string)} key - An integer value that corresponds to an entry in the 'array' argument or a string that
 * corresponds to a metaProperty value.
 * @param {Object} metaProperty - The property in the '.meta' member that we are trying to match to (usually 'name').
 * @param {Object} array - The {@link ScapeObject} array that contains the state, view, or layer we are looking for.
 * @return this {Object}
 */
Number.isInteger = Number.isInteger || function(value) {     // isInteger: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };
function fetchFromScape(key, metaProperty, array) {
    var callback = newCallback(arguments),
        myKey = false;
    if (array) {
        if (Number.isInteger(key)) {
            myKey = (array[key]) ? array[key]:false;
        } else if (isValidName(key)) {
            for (var i = 0; i < array.length; i++) {
                if (key === array[i].meta[metaProperty]) {
                    myKey = array[i];
                }
            }
        }
    }
    callback(myKey);
    return myKey;
}
module.exports = fetchFromScape;
},{"./../bool/isValidName.js":7,"./../construct/newCallback.js":10}],21:[function(require,module,exports){
(function (global){
/*jslint node: true */
/*global global, module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This internal method is used to retrieve a variable from the global object.
 *
 * @function fetchGlobal
 * @memberof socioscapes
 * @param {string} name - A string that corresponds to a variable in the global object.
 * @return {Object} myGlobal - Returns the corresponding {@link ScapeObject} or undefined.
 */
function fetchGlobal(name) {
    var callback = newCallback(arguments),
        myGlobal;
    if (window) {
        myGlobal = window[name];
    } else if (global) {
        myGlobal = global[name];
    }
    callback(myGlobal);
    return myGlobal;
}
module.exports = fetchGlobal;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./../construct/newCallback.js":10}],22:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google, gapi, auth, authorize, access_token*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This function requests authorization to use a Google API, and if received, loads that API client. For more information
 * on Google APIs, see {@link http://developers.google.com/api-client-library/javascript/reference/referencedocs}.
 *
 * @function fetchGoogleAuth
 * @memberof socioscapes
 * @param {Object} config - An object with configuration options for Google APIs.
 * @param {Object} config.auth - Configuration options for the auth request (eg. .client_id, .scope, .immediate)
 * @param {Object} config.client.name - The name of the Google API client to load.
 * @param {Object} config.client.version - The version of the Google API client to load.
 * @return this {Object}
 */
function fetchGoogleAuth(config) {
    var callback = newCallback(arguments);
    gapi.auth.authorize(config.auth, function (token) {
        if (token && token.access_token) {
            gapi.client.load(config.client.name, config.client.version, function (result) {
                callback(result);
                return result;
            });
        }
    });
}
module.exports = fetchGoogleAuth;
},{"./../construct/newCallback.js":10}],23:[function(require,module,exports){
/*jslint node: true */
/*global module, require, gapi*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    fetchGoogleAuth = require('./../fetch/fetchGoogleAuth.js'),
    geostats = require('./../lib/geostats.min.js');
/**
 * This internal method fetches data from Google BigQuery. If necessary, it also requests a gapi authorization token and
 * loads the gapi BigQuery client.
 *
 * If successful, callsback with fetch results.
 *
 * @function fetchGoogleBq
 * @memberof socioscapes
 * @param {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 * @param {Object} [config] - A configuration object for the gapi.auth and gapi.config api. If missing, defaults will
 * be used (see the 'gapiConfig' variable).
 * @return {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 */
function fetchGoogleBq(scapeObject, config) {
    config = config || {};
    var callback = newCallback(arguments),
        authClientId = config.clientId || false,
        authImmediate = config.immediate || false,
        authScope = config.scope || false,
        authToken = config.auth || false,
        featureIdProperty = (config && config.featureIdProperty) ? config.featureIdProperty.toLowerCase():'dauid',
        indexOfFeatureProperty = 1,
        indexOfValueProperty = 0,
        normalizationIdProperty = (config && config.normalizationIdProperty) ? config.normalizationIdProperty.toLowerCase(): 'none',
        queryDataId = config.id || false,
        queryFetcher,
        queryProjectId = config.projectId || false,
        queryRequest,
        queryResult,
        queryString = config.queryString || false,
        valueIdProperty = (config && config.valueIdProperty) ? config.valueIdProperty.toLowerCase():'total',
        gapiConfig = {
            auth: {
                "client_id": authClientId,
                'scope': authScope || ['https://www.googleapis.com/auth/bigquery'],
                'immediate': authImmediate || true
            },
            client: {
                'name': 'bigquery',
                'version': 'v2'
            },
            query: {
                'projectId': queryProjectId,
                'timeoutMs': '30000',
                'query': queryString
            }
        };
        if (authToken) {
            gapi.auth.setToken({
                access_token: authToken.access_token
            });
            gapi.client.load(gapiConfig.client.name, gapiConfig.client.version, function() {
                queryFetcher(authToken);
            });
        } else {
            fetchGoogleAuth(gapiConfig, function () {
                queryFetcher();
            });
        }
        queryFetcher = function() {
            queryRequest = gapi.client.bigquery.jobs.query(gapiConfig.query);
            queryRequest.execute(function(result) {
                queryResult = {
                    meta: {
                        bqQueryString: queryString,
                        bqTableId: queryDataId,
                        columns: [],
                        errors: [],
                        featureIdProperty: featureIdProperty,
                        normalizationIdProperty: normalizationIdProperty,
                        valueIdProperty: valueIdProperty,
                        source: "Google BigQuery, " + gapiConfig.client.version,
                        totalRows: parseInt(result.totalRows)
                    },
                    byColumn: {},
                    byId: {},
                    geoJson: {
                        "type": "FeatureCollection",
                        "features": []
                    },
                    raw: result
                };
                for (var i = 0; i < result.schema.fields.length; i++) {
                    queryResult.meta.columns.push(result.schema.fields[i].name.toLowerCase());
                    queryResult.byColumn[result.schema.fields[i].name.toLowerCase()] = [];
                    indexOfFeatureProperty = (result.schema.fields[i].name.toLowerCase() === featureIdProperty) ? i:indexOfFeatureProperty;
                    indexOfValueProperty = (result.schema.fields[i].name.toLowerCase() === valueIdProperty) ? i:indexOfValueProperty;
                }
                result.rows.forEach(function(row) {
                    for (var i = 0, parsedRow = {}; i < row.f.length; i++) {
                        if (isNaN(row.f[i].v)) {
                            queryResult.meta.errors.push(row.f[i]);
                            row.f[i].v = 0;
                        }
                        if (i === indexOfValueProperty) {
                            row.f[i].v = parseFloat(row.f[i].v);
                        }
                        if (isNaN(row.f[i].v)) {
                            queryResult.meta.errors.push(row.f[i]);
                            row.f[i].v = 0;
                        }
                        parsedRow[result.schema.fields[i].name] = row.f[i].v;
                        queryResult.byColumn[result.schema.fields[i].name].push(row.f[i].v);
                    }
                    queryResult.geoJson.features.push( { "type": "Feature", "properties": parsedRow } );
                    queryResult.byId[parsedRow[featureIdProperty]] = parsedRow;
                });
                queryResult.geostats = new geostats(queryResult.byColumn[valueIdProperty]);
                callback(queryResult);
            });
        };
    return scapeObject;
}
module.exports = fetchGoogleBq;
},{"./../construct/newCallback.js":10,"./../fetch/fetchGoogleAuth.js":22,"./../lib/geostats.min.js":28}],24:[function(require,module,exports){
/*jslint node: true */
/*global module, require, google*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This internal method executes a Google Geocoder query for 'address' and returns the results in an object. Make sure
 * you obtain Google auth and load the GAPI client first.
 *
 * @function fetchGoogleGeocode
 * @memberof socioscapes
 * @param {String} address - The address around which the map around (eg. 'Toronto, Canada').
 * @return {Object} geocode - An object with latitude and longitude coordinates.
 */
function fetchGoogleGeocode(address) {
    var callback = newCallback(arguments),
        geocoder = new google.maps.Geocoder(),
        geocode = {};
    geocoder.geocode({'address': address}, function (result, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            geocode.lat = result[0].geometry.location.lat();
            geocode.lng = result[0].geometry.location.lng();
            geocode.raw = result;
            callback(geocode);
        } else {
            console.log('Error: Google Geocoder was unable to locate ' + address);
        }
    });
}
module.exports = fetchGoogleGeocode;
},{"./../construct/newCallback.js":10}],25:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var fetchGlobal = require('./../fetch/fetchGlobal.js'),
    newCallback = require('./../construct/newCallback.js'),
    isValidObject = require('./../bool/isValidObject.js');
/**
 * This internal method is used to access a {@link ScapeObjec}. Currently limited to simply checking the global object but
 * future versions may allow loading from urls or local storage.
 *
 * @function fetchScape
 * @memberof socioscapes
 * @param {Object} scapeObject - A {@link ScapeObject} or a string that corresponds to a {@link ScapeObject} in the global object.
 * @return myObject {Object} - Returns the corresponding {@link ScapeObject} or undefined.
 */
function fetchScape(scapeObject) {
    var callback = newCallback(arguments),
        myObject;
    if (typeof scapeObject === 'string') {
        if (fetchGlobal(scapeObject)) {
          if (isValidObject(fetchGlobal(scapeObject))) {
              myObject = fetchGlobal(scapeObject);
          }
        }
    } else {
        if (isValidObject(scapeObject)) {
            myObject = scapeObject;
        }
    }
    callback(myObject);
    return myObject;
}
module.exports = fetchScape;
},{"./../bool/isValidObject.js":8,"./../construct/newCallback.js":10,"./../fetch/fetchGlobal.js":21}],26:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    schema = require('./../core/schema.js');
/**
 * This internal method returns the .schema entry that corresponds to 'type'.
 *
 * @function fetchScapeSchema
 * @memberof socioscapes
 * @param {string} type - The type of schema definition to fetch.
 * @return myObject {Object} - Returns the corresponding schema entry or undefined.
 */
var fetchScapeSchema = function fetchScapeSchema(type) {
    var callback = newCallback(arguments),
        myObject,
        index = schema.index;
    type = (type.indexOf('.') > -1) ? type.split('.')[0] : type;
    if (type) {
        myObject = index[type].schema;
    }
    callback(myObject);
    return myObject;
};
module.exports = fetchScapeSchema;
},{"./../construct/newCallback.js":10,"./../core/schema.js":18}],27:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js');
/**
 * This internal method asynchronously fetches geometry from a Web Feature Service server. It expects geoJson and
 * returns the queried url, the id parameter, and the fetched features.
 *
 * If successful, callsback with fetch results.
 *
 * @function fetchWfs
 * @memberof socioscapes
 * @param {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 * @param {string} url - A valid wfs url that returns geoJson FeatureCollection.
 * @return {Object} scapeObject - The {@link ScapeObject} within which the query results will be stored.
 */
function fetchWfs(scapeObject, url) {
    var callback = newCallback(arguments),
        xobj = new XMLHttpRequest(),
        geom;
    xobj.overrideMimeType("application/json"); // From http://codepen.io/KryptoniteDove/blog/load-json-file-locally-using-pure-javascript
    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState === 4 && xobj.status === 200) {
            geom = {};
            geom.geoJson = JSON.parse(xobj.responseText);
            geom.meta = {};
            geom.meta.crs = geom.geoJson.crs.properties.name;
            geom.meta.totalFeatures = parseInt(geom.geoJson.totalFeatures);
            geom.meta.type = 'geoJson';
            geom.meta.source = 'Web Feature Service';
            geom.meta.wfsQueryString = url;
            callback(geom);
        }
    };
    xobj.send(null);
    return scapeObject;
}
module.exports = fetchWfs;
},{"./../construct/newCallback.js":10}],28:[function(require,module,exports){
(function(l){"object"===typeof exports?module.exports=l():"function"===typeof define&&define.amd?define(l):geostats=l()})(function(){var l=function(f){return"number"===typeof f&&parseFloat(f)==parseInt(f,10)&&!isNaN(f)};Array.prototype.indexOf||(Array.prototype.indexOf=function(f,a){if(void 0===this||null===this)throw new TypeError('"this" is null or not defined');var b=this.length>>>0;a=+a||0;Infinity===Math.abs(a)&&(a=0);0>a&&(a+=b,0>a&&(a=0));for(;a<b;a++)if(this[a]===f)return a;return-1});return function(f){this.objectID=
    "";this.legendSeparator=this.separator=" - ";this.method="";this.precision=0;this.precisionflag="auto";this.roundlength=2;this.silent=this.debug=this.is_uniqueValues=!1;this.bounds=[];this.ranges=[];this.inner_ranges=null;this.colors=[];this.counter=[];this.stat_cov=this.stat_stddev=this.stat_variance=this.stat_pop=this.stat_min=this.stat_max=this.stat_sum=this.stat_median=this.stat_mean=this.stat_sorted=null;this.log=function(a,b){1!=this.debug&&null==b||console.log(this.objectID+"(object id) :: "+
    a)};this.setBounds=function(a){this.log("Setting bounds ("+a.length+") : "+a.join());this.bounds=[];this.bounds=a};this.setSerie=function(a){this.log("Setting serie ("+a.length+") : "+a.join());this.serie=[];this.serie=a;this.setPrecision()};this.setColors=function(a){this.log("Setting color ramp ("+a.length+") : "+a.join());this.colors=a};this.doCount=function(){if(!this._nodata()){var a=this.sorted();this.counter=[];for(i=0;i<this.bounds.length-1;i++)this.counter[i]=0;for(j=0;j<a.length;j++){var b=
    this.getClass(a[j]);this.counter[b]++}}};this.setPrecision=function(a){"undefined"!==typeof a&&(this.precisionflag="manual",this.precision=a);if("auto"==this.precisionflag)for(a=0;a<this.serie.length;a++){var b=isNaN(this.serie[a]+"")||-1==(this.serie[a]+"").toString().indexOf(".")?0:(this.serie[a]+"").split(".")[1].length;b>this.precision&&(this.precision=b)}this.log("Calling setPrecision(). Mode : "+this.precisionflag+" - Decimals : "+this.precision);this.serie=this.decimalFormat(this.serie)};this.decimalFormat=
    function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c];!isNaN(parseFloat(d))&&isFinite(d)?b[c]=parseFloat(a[c].toFixed(this.precision)):b[c]=a[c]}return b};this.setRanges=function(){this.ranges=[];for(i=0;i<this.bounds.length-1;i++)this.ranges[i]=this.bounds[i]+this.separator+this.bounds[i+1]};this.min=function(){if(!this._nodata())return this.stat_min=Math.min.apply(null,this.serie)};this.max=function(){return this.stat_max=Math.max.apply(null,this.serie)};this.sum=function(){if(!this._nodata()){if(null==
    this.stat_sum)for(i=this.stat_sum=0;i<this.pop();i++)this.stat_sum+=parseFloat(this.serie[i]);return this.stat_sum}};this.pop=function(){if(!this._nodata())return null==this.stat_pop&&(this.stat_pop=this.serie.length),this.stat_pop};this.mean=function(){if(!this._nodata())return null==this.stat_mean&&(this.stat_mean=parseFloat(this.sum()/this.pop())),this.stat_mean};this.median=function(){if(!this._nodata()){if(null==this.stat_median){this.stat_median=0;var a=this.sorted();this.stat_median=a.length%
2?parseFloat(a[Math.ceil(a.length/2)-1]):(parseFloat(a[a.length/2-1])+parseFloat(a[a.length/2]))/2}return this.stat_median}};this.variance=function(){round="undefined"===typeof round?!0:!1;if(!this._nodata()){if(null==this.stat_variance){for(var a=0,b=0;b<this.pop();b++)a+=Math.pow(this.serie[b]-this.mean(),2);this.stat_variance=a/this.pop();1==round&&(this.stat_variance=Math.round(this.stat_variance*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))}return this.stat_variance}};this.stddev=
    function(a){a="undefined"===typeof a?!0:!1;if(!this._nodata())return null==this.stat_stddev&&(this.stat_stddev=Math.sqrt(this.variance()),1==a&&(this.stat_stddev=Math.round(this.stat_stddev*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))),this.stat_stddev};this.cov=function(a){a="undefined"===typeof a?!0:!1;if(!this._nodata())return null==this.stat_cov&&(this.stat_cov=this.stddev()/this.mean(),1==a&&(this.stat_cov=Math.round(this.stat_cov*Math.pow(10,this.roundlength))/Math.pow(10,this.roundlength))),
    this.stat_cov};this._nodata=function(){return 0==this.serie.length?(this.silent?this.log("[silent mode] Error. You should first enter a serie!",!0):alert("Error. You should first enter a serie!"),1):0};this._hasNegativeValue=function(){for(i=0;i<this.serie.length;i++)if(0>this.serie[i])return!0;return!1};this._hasZeroValue=function(){for(i=0;i<this.serie.length;i++)if(0===parseFloat(this.serie[i]))return!0;return!1};this.sorted=function(){null==this.stat_sorted&&(this.stat_sorted=0==this.is_uniqueValues?
    this.serie.sort(function(a,b){return a-b}):this.serie.sort(function(a,b){var c=a.toString().toLowerCase(),d=b.toString().toLowerCase();return c<d?-1:c>d?1:0}));return this.stat_sorted};this.info=function(){if(!this._nodata()){var a;a=""+("Population : "+this.pop()+" - [Min : "+this.min()+" | Max : "+this.max()+"]\n");a+="Mean : "+this.mean()+" - Median : "+this.median()+"\n";return a+="Variance : "+this.variance()+" - Standard deviation : "+this.stddev()+" - Coefficient of variation : "+this.cov()+
    "\n"}};this.setClassManually=function(a){if(!this._nodata())if(a[0]!==this.min()||a[a.length-1]!==this.max())if(this.silent)this.log("[silent mode] "+t("Given bounds may not be correct! please check your input.\nMin value : "+this.min()+" / Max value : "+this.max()),!0);else{a=alert;var b="Given bounds may not be correct! please check your input.\nMin value : "+this.min()+" / Max value : "+this.max();a(b)}else return this.setBounds(a),this.setRanges(),this.method="manual classification ("+(a.length-
    1)+" classes)",this.bounds};this.getClassEqInterval=function(a,b,c){if(!this._nodata()){b="undefined"===typeof b?this.min():b;c="undefined"===typeof c?this.max():c;var d=[],e=b;b=(c-b)/a;for(i=0;i<=a;i++)d[i]=e,e+=b;d[a]=c;this.setBounds(d);this.setRanges();this.method="eq. intervals ("+a+" classes)";return this.bounds}};this.getQuantiles=function(a){for(var b=this.sorted(),c=[],d=this.pop()/a,e=1;e<a;e++){var h=Math.round(e*d+.49);c.push(b[h-1])}return c};this.getClassQuantile=function(a){if(!this._nodata()){var b=
    this.sorted(),c=this.getQuantiles(a);c.unshift(b[0]);c[b.length-1]!==b[b.length-1]&&c.push(b[b.length-1]);this.setBounds(c);this.setRanges();this.method="quantile ("+a+" classes)";return this.bounds}};this.getClassStdDeviation=function(a,b){if(!this._nodata()){this.max();this.min();var c=[];if(1==a%2){var d=Math.floor(a/2),e=d+1;c[d]=this.mean()-this.stddev()/2;c[e]=this.mean()+this.stddev()/2;i=d-1}else e=a/2,c[e]=this.mean(),i=e-1;for(;0<i;i--)d=c[i+1]-this.stddev(),c[i]=d;for(i=e+1;i<a;i++)d=c[i-
    1]+this.stddev(),c[i]=d;c[0]="undefined"===typeof b?c[1]-this.stddev():this.min();c[a]="undefined"===typeof b?c[a-1]+this.stddev():this.max();this.setBounds(c);this.setRanges();this.method="std deviation ("+a+" classes)";return this.bounds}};this.getClassGeometricProgression=function(a){if(!this._nodata())if(this._hasNegativeValue()||this._hasZeroValue())this.silent?this.log("[silent mode] geometric progression can't be applied with a serie containing negative or zero values.",!0):alert("geometric progression can't be applied with a serie containing negative or zero values.");
else{var b=[],c=this.min(),d=this.max(),d=Math.log(d)/Math.LN10,c=Math.log(c)/Math.LN10,d=(d-c)/a;for(i=0;i<a;i++)b[i]=0==i?c:b[i-1]+d;b=b.map(function(a){return Math.pow(10,a)});b.push(this.max());this.setBounds(b);this.setRanges();this.method="geometric progression ("+a+" classes)";return this.bounds}};this.getClassArithmeticProgression=function(a){if(!this._nodata()){var b=0;for(i=1;i<=a;i++)b+=i;var c=[],d=this.min(),b=(this.max()-d)/b;for(i=0;i<=a;i++)c[i]=0==i?d:c[i-1]+i*b;this.setBounds(c);
    this.setRanges();this.method="arithmetic progression ("+a+" classes)";return this.bounds}};this.getClassJenks=function(a){if(!this._nodata()){dataList=this.sorted();for(var b=[],c=0,d=dataList.length+1;c<d;c++){for(var e=[],h=0,k=a+1;h<k;h++)e.push(0);b.push(e)}c=[];d=0;for(e=dataList.length+1;d<e;d++){for(var h=[],k=0,f=a+1;k<f;k++)h.push(0);c.push(h)}d=1;for(e=a+1;d<e;d++){b[0][d]=1;c[0][d]=0;for(var g=1,h=dataList.length+1;g<h;g++)c[g][d]=Infinity;g=0}d=2;for(e=dataList.length+1;d<e;d++){for(var f=
    k=h=0,l=1,r=d+1;l<r;l++){var p=d-l+1,g=parseFloat(dataList[p-1]),k=k+g*g,h=h+g,f=f+1,g=k-h*h/f,q=p-1;if(0!=q)for(var m=2,u=a+1;m<u;m++)c[d][m]>=g+c[q][m-1]&&(b[d][m]=p,c[d][m]=g+c[q][m-1])}b[d][1]=1;c[d][1]=g}g=dataList.length;c=[];for(d=0;d<=a;d++)c.push(0);c[a]=parseFloat(dataList[dataList.length-1]);c[0]=parseFloat(dataList[0]);for(d=a;2<=d;)e=parseInt(b[g][d]-2),c[d-1]=dataList[e],g=parseInt(b[g][d]-1),--d;c[0]==c[1]&&(c[0]=0);this.setBounds(c);this.setRanges();this.method="Jenks ("+a+" classes)";
    return this.bounds}};this.getClassUniqueValues=function(){if(!this._nodata()){this.is_uniqueValues=!0;var a=this.sorted(),b=[];for(i=0;i<this.pop();i++)-1===b.indexOf(a[i])&&b.push(a[i]);this.bounds=b;this.method="unique values";return b}};this.getClass=function(a){for(i=0;i<this.bounds.length;i++)if(1==this.is_uniqueValues){if(a==this.bounds[i])return i}else if(parseFloat(a)<=this.bounds[i+1])return i;return"Unable to get value's class."};this.getRanges=function(){return this.ranges};this.getRangeNum=
    function(a){var b,c;for(c=0;c<this.ranges.length;c++)if(b=this.ranges[c].split(/ - /),a<=parseFloat(b[1]))return c};this.getInnerRanges=function(){if(null!=this.inner_ranges)return this.inner_ranges;var a=[],b=this.sorted(),c=1;for(i=0;i<b.length;i++){if(0==i)var d=b[i];parseFloat(b[i])>parseFloat(this.bounds[c])&&(a[c-1]=""+d+this.separator+b[i-1],d=b[i],c++);if(c==this.bounds.length-1)return a[c-1]=""+d+this.separator+b[b.length-1],this.inner_ranges=a}};this.getSortedlist=function(){return this.sorted().join(", ")};
    this.getHtmlLegend=function(a,b,c,d,e,f){var k="",n=[];this.doCount();ccolors=null!=a?a:this.colors;lg=null!=b?b:"Legend";getcounter=null!=c?!0:!1;fn=null!=d?d:function(a){return a};null==e&&(e="default");if("discontinuous"==e&&(this.getInnerRanges(),-1!==this.counter.indexOf(0))){this.silent?this.log("[silent mode] geostats cannot apply 'discontinuous' mode to the getHtmlLegend() method because some classes are not populated.\nPlease switch to 'default' or 'distinct' modes. Exit!",!0):alert("geostats cannot apply 'discontinuous' mode to the getHtmlLegend() method because some classes are not populated.\nPlease switch to 'default' or 'distinct' modes. Exit!");
        return}"DESC"!==f&&(f="ASC");if(ccolors.length<this.ranges.length)this.silent?this.log("[silent mode] The number of colors should fit the number of ranges. Exit!",!0):alert("The number of colors should fit the number of ranges. Exit!");else{if(0==this.is_uniqueValues)for(i=0;i<this.ranges.length;i++)!0===getcounter&&(k=' <span class="geostats-legend-counter">('+this.counter[i]+")</span>"),b=this.ranges[i].split(this.separator),a=parseFloat(b[0]).toFixed(this.precision),b=parseFloat(b[1]).toFixed(this.precision),
    "distinct"==e&&0!=i&&(l(a)?(a=parseInt(a)+1,"manual"==this.precisionflag&&0!=this.precision&&(a=parseFloat(a).toFixed(this.precision))):(a=parseFloat(a)+1/Math.pow(10,this.precision),a=parseFloat(a).toFixed(this.precision))),"discontinuous"==e&&(b=this.inner_ranges[i].split(this.separator),a=parseFloat(b[0]).toFixed(this.precision),b=parseFloat(b[1]).toFixed(this.precision)),a=fn(a)+this.legendSeparator+fn(b),a='<div><div class="geostats-legend-block" style="background-color:'+ccolors[i]+'"></div> '+
        a+k+"</div>",n.push(a);else for(i=0;i<this.bounds.length;i++)!0===getcounter&&(k=' <span class="geostats-legend-counter">('+this.counter[i]+")</span>"),a=fn(this.bounds[i]),a='<div><div class="geostats-legend-block" style="background-color:'+ccolors[i]+'"></div> '+a+k+"</div>",n.push(a);"DESC"===f&&n.reverse();e='<div class="geostats-legend"><div class="geostats-legend-title">'+lg+"</div>";for(i=0;i<n.length;i++)e+=n[i];return e+"</div>"}};this.objectID=(new Date).getUTCMilliseconds();this.log("Creating new geostats object");
    "undefined"!==typeof f&&0<f.length?(this.serie=f,this.setPrecision(),this.log("Setting serie ("+f.length+") : "+f.join())):this.serie=[];this.getJenks=this.getClassJenks;this.getGeometricProgression=this.getClassGeometricProgression;this.getEqInterval=this.getClassEqInterval;this.getQuantile=this.getClassQuantile;this.getStdDeviation=this.getClassStdDeviation;this.getUniqueValues=this.getClassUniqueValues;this.getArithmeticProgression=this.getClassArithmeticProgression}});
},{}],29:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var socioscapes = require('./core/core.js'),
    viewGmaps = require('./extension/viewGmaps.js');
/**
 * Socioscapes is a javascript alternative to desktop geographic information systems and proprietary data visualization
 * platforms. The modular API fuses various free-to-use and open-source GIS libraries into an organized, modular, and
 * sandboxed environment.
 *
 *    Source code...................... http://github.com/moismailzai/socioscapes
 *    Reference implementation......... http://app.socioscapes.com
 *    License.......................... MIT license (free as in beer & speech)
 *    Copyright........................ © 2016 Misaqe Ismailzai
 *
 * This software was originally conceived as partial fulfilment of the degree requirements for the Masters of Arts in
 * Sociology at the University of Toronto.
 */

// to extend socioscapes, simply call the extension with the socioscapes object as argument
viewGmaps(socioscapes);

module.exports = socioscapes;
},{"./core/core.js":16,"./extension/viewGmaps.js":19}],30:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var fetchFromScape = require('./../fetch/fetchFromScape.js');
/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuClass'.
 *
 * @function menuClass
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} [name] - Not implemented.
 * @return {Object} - A {@link socioscapes} {@link ScapeObject} object.
 */
function menuClass(context, name) {
    name = (typeof name === 'string') ? name : context.schema.name;
    return fetchFromScape(name, 'name', context.object);
}
module.exports = menuClass;
},{"./../fetch/fetchFromScape.js":20}],31:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuConfig'.
 *
 * @function menuConfig
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} context.that - A {@link socioscapes} {@link ScapeObject} object.
 */
function menuConfig(context, command, config) {
    var callback = newCallback(arguments),
        myCommand = (typeof command === 'function') ? command: false;
    if (myCommand) {
        myCommand(context.that, config, function (result) {
            console.log('The results of your "' + myCommand.name + '" are ready.');
            newEvent('socioscapes.ready.' + myCommand.name, context);
            callback(result);
        });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
        callback(false);
    }
    return context.that;
}
module.exports = menuConfig;
},{"./../construct/newCallback.js":10,"./../construct/newEvent.js":12}],32:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuRequire'.
 *
 * @function menuRequire
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} context.that - A {@link socioscapes} {@link ScapeObject} object.
 */
function menuRequire(context, command, config) {
    var callback = newCallback(arguments);
    callback(context.that);
    return context.that;
}
module.exports = menuRequire;
},{"./../construct/newCallback.js":10,"./../construct/newEvent.js":12}],33:[function(require,module,exports){
/*jslint node: true */
/*global module, require*/
'use strict';
var newCallback = require('./../construct/newCallback.js'),
    newEvent = require('./../construct/newEvent.js');
/**
 * This method returns a {@link ScapeObject} object for schema entries where menu === 'menuRequire'.
 *
 * @function menuStore
 * @memberof socioscapes
 * @param {Object} context - A context object sent by the a {@link ScapeMenu} call (this allows us to use the correct
 * {@link ScapeObject} for our context).
 * @param {string} command - Should correspond to a socioscapes.fn or soioscapes.fn.alias member name.
 * @param {Object} [config] - A configuration object for the corresponding command function.
 * @return {Object} context.that - A {@link socioscapes} {@link ScapeObject} object.
 */
function menuStore(context, command, config) {
    var callback = newCallback(arguments),
        myCommand = (typeof command === 'function') ? command: false;
    if (myCommand) {
        myCommand(context.that, config, function (result) {
            if (result) {
                for (var prop in result) {
                    if (result.hasOwnProperty(prop)) {
                        delete context.object[prop];
                        context.object[prop] = result[prop];
                    }
                }
            }
            console.log('The results of your "' + myCommand.name + '" query are ready.');
            newEvent('socioscapes.ready.' + myCommand.name, context);
            callback(result);
        });
    } else {
        console.log('Sorry, "' + command + '" is not a valid function.');
        callback(false);
    }
    return context.that;
}
module.exports = menuStore;
},{"./../construct/newCallback.js":10,"./../construct/newEvent.js":12}],34:[function(require,module,exports){
var assert = require('assert');
var socioscapes = require('../../src/main.js');
describe('socioscapes', function() {
    describe('#socioscapes', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes === 'function');
        });
        it('should return an object', function () {
            assert.equal(true, typeof socioscapes() === 'object');
        });
        it('should create "scape0" when run without an argument', function () {
            delete 'scape0';
            socioscapes();
            assert.equal(true, !!scape0);
        });
        it('should load "myArbitraryScape" when given argument "myArbitraryScape"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal(true, socioscapes('myArbitraryScape').meta.name === 'myArbitraryScape');
            delete myArbitraryScape;
        });
        it('should return an object with OBJECT member .meta', function () {
            assert.equal(true, !!socioscapes().meta);
            assert.equal(true, typeof socioscapes().meta === 'object');
        });
        it('should return an object with FUNCTION member .new', function () {
            assert.equal(true, !!socioscapes().new);
            assert.equal(true, typeof socioscapes().new === 'function');
        });
        it('should return an object with OBJECT member .schema', function () {
            assert.equal(true, !!socioscapes().schema);
            assert.equal(true, typeof socioscapes().schema === 'object');
        });
        it('should return an object with FUNCTION member .state', function () {
            assert.equal(true, !!socioscapes().state);
            assert.equal(true, typeof socioscapes().state === 'function');
        });
        it('should return an object with OBJECT member .this', function () {
            assert.equal(true, !!socioscapes().this);
            assert.equal(true, typeof socioscapes().this === 'object');
        });
    });
    describe('#socioscapes().meta', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().meta === 'object');
        });
        it('should have a .type member with value "scape.sociJson"', function () {
            assert.equal('scape.sociJson', socioscapes().meta.type);
        });
    });
    describe('#socioscapes().new', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes().new === 'function');
        });
        it('should create global object "myArbitraryScape" when given argument "myArbitraryScape"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal(true, !!myArbitraryScape);
            delete myArbitraryScape;
        });
        it('should create objects that have a meta.type member with value "scape.sociJson"', function () {
            socioscapes().new('myArbitraryScape');
            assert.equal('scape.sociJson', myArbitraryScape.meta.type);
            delete myArbitraryScape;
        });
    });
    describe('#socioscapes().schema', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().schema === 'object');
        });
    });
    describe('#socioscapes().state', function () {
        it('should be a function', function () {
            assert.equal(true, typeof socioscapes().state === 'function');
        });
    });
    describe('#socioscapes().this', function () {
        it('should be an object', function () {
            assert.equal(true, typeof socioscapes().this === 'object');
        });
    });
});
},{"../../src/main.js":29,"assert":1}]},{},[34]);
