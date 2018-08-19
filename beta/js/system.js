// region Polyfills

// IE 11.228.17134.0
if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}

// IE 11.228.17134.0
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function(search, this_len) {
		if (this_len === undefined || this_len > this.length) {
			this_len = this.length;
		}

		return this.substring(this_len - search.length, this_len) === search;
	};
}

// IE 11.228.17134.0
if (!String.prototype.repeat) {
	String.prototype.repeat = function(count) {
		'use strict';

		if (this === null) {
			throw new TypeError('can\'t convert ' + this + ' to object');
		}

		var str = '' + this;

		count = +count;

		if (count !== count) {
			count = 0;
		}

		if (count < 0) {
			throw new RangeError('repeat count must be non-negative');
		}

		if (count === Infinity) {
			throw new RangeError('repeat count must be less than infinity');
		}

		count = Math.floor(count);

		if (str.length === 0 || count === 0) {
			return '';
		}

		if (str.length * count >= 1 << 28) {
			throw new RangeError('repeat count must not overflow maximum string size');
		}
		var rpt = '';

		for (var i = 0; i < count; i++) {
			rpt += str;
		}

		return rpt;
	}
}

// IE 11.228.17134.0
if (!String.prototype.padStart) {
	String.prototype.padStart = function padStart(targetLength, padString) {
		targetLength = targetLength >> 0;
		padString = String((typeof padString !== 'undefined' ? padString : ' '));

		if (this.length > targetLength) {
			return String(this);
		} else {
			targetLength = targetLength - this.length;

			if (targetLength > padString.length) {
				// noinspection JSValidateTypes
				padString += padString.repeat(targetLength/padString.length);
			}

			return padString.slice(0, targetLength) + String(this);
		}
	};
}

// IE 11.228.17134.0
if (!Array.from) {
	Array.from = (function() {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike/*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method
			// of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}

// IE 7/8
if (!Object.keys) {
	Object.keys = (function() {
		'use strict';
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function(obj) {
			if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
				throw new TypeError('Object.keys called on non-object');
			}

			var result = [], prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	}());
}

// IE 11.228.17134.0
if (!console.table) {
	console.table = function(arr) {
		var i, obj, keys, arr_len = arr.length;

		for (i = 0; i < arr_len; i++) {
			obj = arr[i];
			keys = Object.keys(obj);
			console.log(obj[keys[0]] + ': ' + obj[keys[1]]);
		}
	};
}
// endregion

// noinspection ThisExpressionReferencesGlobalObjectJS
(function(global) {

	// region Functions

	if (!global.importScripts) {
		// Poor's man requirejs :)
		global.importScripts = function (url, callback) {
			// noinspection JSUnresolvedFunction
			if (!url.startsWith('js/')) {
				url = 'js/' + url;
			}

			// noinspection JSUnresolvedFunction
			if (!url.endsWith('.js')) {
				url += '.js';
			}

			var script = document.createElement('script');
			script.src = url;
			script.onload = typeof callback === 'function' ? callback : function() {};
			document.head.appendChild(script);
		}
	}

	if (!global.$) {
		// Poor's man jQuery :)
		global.$ = function (selector) {
			if (document.querySelector) {
				return document.querySelector(selector);
			} else {
				switch (selector.charAt(0)) {
					case '.':
						return document.getElementsByClassName(selector.substr(1))[0];
					case '#':
						return document.getElementById(selector.substr(1));
					default:
						return document.getElementsByTagName(selector)[0];
				}
			}
		}
	}

	function dumpSystem() {
		console.table([{
			Feature: 'SYSTEM_FEATURE_ES5',
			Value: SYSTEM_FEATURE_ES5 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_ES6',
			Value: SYSTEM_FEATURE_ES6 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WORKERS',
			Value: SYSTEM_FEATURE_WORKERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SHARED_WORKERS',
			Value: SYSTEM_FEATURE_SHARED_WORKERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_TYPED_ARRAYS',
			Value: SYSTEM_FEATURE_TYPED_ARRAYS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_BIGINTS',
			Value: SYSTEM_FEATURE_BIGINTS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SIMD',
			Value: SYSTEM_FEATURE_SIMD ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_FULLSCREEN',
			Value: SYSTEM_FEATURE_FULLSCREEN ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_POINTER_LOCK',
			Value: SYSTEM_FEATURE_POINTER_LOCK ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_TIMERS',
			Value: SYSTEM_FEATURE_TIMERS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_CANVAS',
			Value: SYSTEM_FEATURE_CANVAS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBGL',
			Value: SYSTEM_FEATURE_WEBGL ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBGL2',
			Value: SYSTEM_FEATURE_WEBGL2 ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBVR',
			Value: SYSTEM_FEATURE_WEBVR ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_HTML5AUDIO',
			Value: SYSTEM_FEATURE_HTML5AUDIO ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBAUDIO',
			Value: SYSTEM_FEATURE_WEBAUDIO ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_KEYBOARD',
			Value: SYSTEM_FEATURE_KEYBOARD ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_POINTER_EVENTS',
			Value: SYSTEM_FEATURE_POINTER_EVENTS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_GAMEPADS',
			Value: SYSTEM_FEATURE_GAMEPADS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBSOCKETS',
			Value: SYSTEM_FEATURE_WEBSOCKETS ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_SESSION_STORAGE',
			Value: SYSTEM_FEATURE_SESSION_STORAGE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_LOCAL_STORAGE',
			Value: SYSTEM_FEATURE_LOCAL_STORAGE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_INDEXED_DB',
			Value: SYSTEM_FEATURE_INDEXED_DB ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_WEBSQL',
			Value: SYSTEM_FEATURE_WEBSQL ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSYEM_FEATURE_GEOLOCATION',
			Value: SYSYEM_FEATURE_GEOLOCATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSYEM_FEATURE_ORIENTATION',
			Value: SYSYEM_FEATURE_ORIENTATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSYEM_FEATURE_MOTION',
			Value: SYSYEM_FEATURE_MOTION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSYEM_FEATURE_GYROSCOPE',
			Value: SYSYEM_FEATURE_GYROSCOPE ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_PROXIMITY',
			Value: SYSTEM_FEATURE_PROXIMITY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_AMBIENTLIGHT',
			Value: SYSTEM_FEATURE_AMBIENTLIGHT ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_VIBRATION',
			Value: SYSTEM_FEATURE_VIBRATION ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_FEATURE_BATTERY',
			Value: SYSTEM_FEATURE_BATTERY ? 'TRUE' : 'FALSE'
		} , {
			Feature: 'SYSTEM_INFO_CPU_ENDIANNESS',
			Value: SYSTEM_INFO_CPU_ENDIANNESS
		} , {
			Feature: 'SYSTEM_INFO_CPU_CORES',
			Value: SYSTEM_INFO_CPU_CORES
		} , {
			Feature: 'SYSTEM_INFO_GPU',
			Value: SYSTEM_INFO_GPU
		} , {
			Feature: 'SYSTEM_INFO_VIDEO_ACCELERATION',
			Value: SYSTEM_INFO_VIDEO_ACCELERATION
		}]);
	}

	// endregion

	// region System

	var audio								= document.createElement('audio');
	var canvas2D							= document.createElement('canvas');
	var context2D							= typeof canvas2D.getContext === 'function' ? canvas2D.getContext('2d') : false;
	var canvasWEBGL							= document.createElement('canvas');
	var contextWEBGL						= typeof canvasWEBGL.getContext === 'function' ? (canvasWEBGL.getContext('webgl') || canvasWEBGL.getContext('experimental-webgl')) : false;
	var canvasWEBGL2						= document.createElement('canvas');
	var contextWEBGL2						= typeof canvasWEBGL2.getContext === 'function' ? (canvasWEBGL2.getContext('webgl2') || canvasWEBGL2.getContext('experimental-webgl2')) : false;

	global.SYSTEM_FEATURE_STRICT			= (function() {'use strict'; return !this; })();
	global.SYSTEM_FEATURE_JSON				= 'JSON' in global && 'parse' in JSON;
	global.SYSTEM_FEATURE_BASE64			= 'btoa' in global && 'atob' in global;
	global.SYSTEM_FEATURE_WORKERS			= !!global.Worker;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_SHARED_WORKERS	= !!global.SharedWorker;
	global.SYSTEM_FEATURE_TYPED_ARRAYS		= typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined' ? typeof Int8Array !== 'undefined' && typeof Uint8Array !== 'undefined' && typeof Uint8ClampedArray !== 'undefined' && typeof Int16Array !== 'undefined' && typeof Uint16Array !== 'undefined' && typeof Int32Array !== 'undefined' && typeof Uint32Array !== 'undefined' && typeof Float32Array !== 'undefined' && typeof Float64Array !== 'undefined': false;
	global.SYSTEM_FEATURE_BIGINTS			= typeof BigInt !== 'undefined' ? typeof BigInt64Array !== 'undefined' && typeof BigUint64Array !== 'undefined' : false;
	// noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols
	global.SYSTEM_FEATURE_SIMD				= typeof SIMD !== 'undefined' ? typeof SIMD.Bool16x8 !== 'undefined' && typeof SIMD.Bool32x4 !== 'undefined' && typeof SIMD.Bool8x16 !== 'undefined' && typeof SIMD.Float32x4 !== 'undefined' && typeof SIMD.Int16x8 !== 'undefined' && typeof SIMD.Int32x4 !== 'undefined' && typeof SIMD.Int8x16 !== 'undefined' && typeof SIMD.Uint32x4 !== 'undefined' && typeof SIMD.Uint8x16 !== 'undefined' : false;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_FULLSCREEN		= !document.documentElement.requestFullscreen ? true : !!document.documentElement.webkitRequestFullScreen || !!document.documentElement.mozRequestFullScreen || !!document.documentElement.msRequestFullscreen;
	global.SYSTEM_FEATURE_POINTER_LOCK		= 'pointerLockElement' in document ? true : 'oPointerLockElement' in document || 'msPointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ANIMATION_FRAME	= !!global.requestAnimationFrame ? true : !!global.webkitRequestAnimationFrame || !!global.mozRequestAnimationFrame || !!global.msRequestAnimationFrame || !!global.oRequestAnimationFrame;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_PERFORMANCE		= !!global.performance ? true : !!global.webkitPerformance || !!global.mozPerformance || !!global.msPerformance || !!global.oPerformance;
	global.SYSTEM_FEATURE_TIMERS			= SYSTEM_FEATURE_ANIMATION_FRAME && SYSTEM_FEATURE_PERFORMANCE;
	global.SYSTEM_FEATURE_CANVAS			= !!(context2D && context2D instanceof CanvasRenderingContext2D);
	global.SYSTEM_FEATURE_WEBGL				= !!(contextWEBGL && contextWEBGL instanceof WebGLRenderingContext);
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_WEBGL2			= !!(contextWEBGL2 && contextWEBGL2 instanceof WebGL2RenderingContext);
	global.SYSTEM_FEATURE_WEBVR				= 'getVRDisplays' in navigator ? true : 'mozGetVRDevices' in navigator;
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_FEATURE_HTML5AUDIO		= (function() {
		try {
			// noinspection JSUnresolvedVariable
			return !!(audio.canPlayType && audio.canPlayType('audio/mpeg;').replace(/no/, ''));
		} catch(e) {
			return false;
		}
	})();
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_FEATURE_WEBAUDIO			= (function() {
		try {
			// noinspection JSUnresolvedVariable
			var context = AudioContext || webkitAudioContext || mozAudioContext || oAudioContext || msAudioContext;
			new context();

			return true;
		} catch(e) {
			return false;
		}
	})();
	// noinspection JSUnusedGlobalSymbols
	// TODO: implement check for keyboard events support
	global.SYSTEM_FEATURE_KEYBOARD			= true;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_POINTER_EVENTS	= !!global.PointerEvent ? true : !!global.webkitPointerEvent || !!global.mozPointerEvent || !!global.msPointerEvent || !!global.oPointerEvent;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_GAMEPADS			= !!navigator.getGamepads ? true : !!navigator.webkitGetGamepads || !!navigator.mozGetGamepads || !!navigator.msGetGamepads || !!navigator.oGetGamepads;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_WEBSOCKETS		= (function() {
		var protocol = 'https:' === location.protocol ? 'wss' : 'ws';

		if ('WebSocket' in global && global.WebSocket.CLOSING === 2) {
			if ('binaryType' in WebSocket.prototype) {
				return true;
			} else {
				try {
					return !!(new WebSocket(protocol + '://.').binaryType);
				} catch (e) {
					return false;
				}
			}
		}
	})();
	global.SYSTEM_FEATURE_SESSION_STORAGE	= 'sessionStorage' in global && global.sessionStorage !== null;
	global.SYSTEM_FEATURE_LOCAL_STORAGE		= 'localStorage' in global && global.localStorage !== null;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_INDEXED_DB		= !!global.indexedDB ? true : !!global.webkitIndexedDB || !!global.mozIndexedDB || !!global.moz_indexedDB || !!global.oIndexedDB || !!global.msIndexedDB;
	global.SYSTEM_FEATURE_WEBSQL			= !!global.openDatabase;
	global.SYSYEM_FEATURE_ORIENTATION		= !!global.DeviceOrientationEvent;
	global.SYSYEM_FEATURE_GEOLOCATION		= !!navigator.geolocation;
	global.SYSYEM_FEATURE_MOTION			= !!global.DeviceMotionEvent;
	// noinspection JSUnresolvedVariable
	global.SYSYEM_FEATURE_GYROSCOPE			= !!global.Gyroscope;
	global.SYSTEM_FEATURE_PROXIMITY			= 'ProximitySensor' in global;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_AMBIENTLIGHT		= !!global.AmbientLightSensor;
	global.SYSTEM_FEATURE_VIBRATION			= 'vibrate' in navigator;
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_BATTERY			= !!navigator.getBattery || !!navigator.battery || !!navigator.mozBattery;
	// TODO: implement check for Generic Sensor API

	// TODO: check why SYSTEM_FEATURE_ES5SYNTAX fails
	global.SYSTEM_FEATURE_ES5SYNTAX			= (function() {
		var value, obj, stringAccess, getter, setter, reservedWords, zeroWidthChars;
		try {
			stringAccess = eval('"foobar"[3] === "b"');
			getter = eval('({ get x(){ return 1 } }).x === 1');
			eval('({ set x(v){ value = v; } }).x = 1');
			// noinspection JSUnusedAssignment
			setter = value === 1;
			eval('obj = ({ if: 1 })');
			// noinspection JSUnusedAssignment
			reservedWords = obj['if'] === 1;
			zeroWidthChars = eval('_\u200c\u200d = true');

			return stringAccess && getter && setter && reservedWords && zeroWidthChars;
		} catch (e) {
			return false;
		}
	})();
	// TODO: check why SYSTEM_FEATURE_ES5UNDEFINED fails
	global.SYSTEM_FEATURE_ES5UNDEFINED		= (function() {
		var result, originalUndefined;
		try {
			originalUndefined = global.undefined;
			global.undefined = 12345;
			result = typeof global.undefined === 'undefined';
			global.undefined = originalUndefined;
		} catch (e) {
			return false;
		}
		return result;
	})();
	global.SYSTEM_FEATURE_ES5ARRAY			= !!(Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray);
	global.SYSTEM_FEATURE_ES5DATE			= (function() {
		var isoDate = '2013-04-12T06:06:37.307Z', canParseISODate = false;

		try {
			canParseISODate = !!Date.parse(isoDate);
		} catch (e) {}

		return !!(Date.now && Date.prototype && Date.prototype.toISOString && Date.prototype.toJSON && canParseISODate);
	})();
	global.SYSTEM_FEATURE_ES5FUNCTION		= !!(Function.prototype && Function.prototype.bind);
	global.SYSTEM_FEATURE_ES5OBJECT			= !!(Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions);
	global.SYSTEM_FEATURE_ES5STRING			= !!(String.prototype && String.prototype.trim);
	global.SYSTEM_FEATURE_ES5				= !!(SYSTEM_FEATURE_STRICT && SYSTEM_FEATURE_JSON && SYSTEM_FEATURE_BASE64 /*&& SYSTEM_FEATURE_ES5SYNTAX && SYSTEM_FEATURE_ES5UNDEFINED*/ && SYSTEM_FEATURE_ES5ARRAY && SYSTEM_FEATURE_ES5DATE && SYSTEM_FEATURE_ES5FUNCTION && SYSTEM_FEATURE_ES5OBJECT && SYSTEM_FEATURE_ES5STRING);

	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ES6NUMBER			= !!(Number.isFinite && Number.isInteger && Number.isSafeInteger && Number.isNaN && Number.parseInt && Number.parseFloat && Number.isInteger(Number.MAX_SAFE_INTEGER) && Number.isInteger(Number.MIN_SAFE_INTEGER) && Number.isFinite(Number.EPSILON));
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ES6MATH			= !!(Math && Math.clz32 && Math.cbrt && Math.imul && Math.sign && Math.log10 && Math.log2 && Math.log1p && Math.expm1 && Math.cosh && Math.sinh && Math.tanh && Math.acosh && Math.asinh && Math.atanh && Math.hypot && Math.trunc && Math.fround);
	global.SYSTEM_FEATURE_ES6ARRAY			= !!(Array.prototype && Array.prototype.copyWithin && Array.prototype.fill && Array.prototype.find && Array.prototype.findIndex && Array.prototype.keys && Array.prototype.entries && Array.prototype.values && Array.from && Array.of);
	global.SYSTEM_FEATURE_ES6FUNCTION		= (function() {
		try {
			eval('()=>{}');
		} catch (e) {
			return false;
		}
		return true;
	})();
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ES6OBJECT			= !!(Object.assign && Object.is && Object.setPrototypeOf);
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ES6STRING			= !!(String.fromCodePoint && String.raw && String.prototype.codePointAt && String.prototype.repeat && String.prototype.startsWith && String.prototype.endsWith && (String.prototype.includes || String.prototype.contains));
	// noinspection JSUnresolvedVariable
	global.SYSTEM_FEATURE_ES6COLLECTIONS	= !!(global.Map && global.Set && global.WeakMap && global.WeakSet);
	global.SYSTEM_FEATURE_ES6GENERATORS		= (function() {
		try {
			new Function('function* test() {}')();
		} catch (e) {
			return false;
		}
		return true;
	})();
	global.SYSTEM_FEATURE_ES6PROMISES		= (function() {
		return 'Promise' in global && 'resolve' in global.Promise && 'reject' in global.Promise && 'all' in global.Promise && 'race' in global.Promise && (function() {
			var resolve;
			// noinspection JSIgnoredPromiseFromCall
			new global.Promise(function(r) { resolve = r; });
			return typeof resolve === 'function';
		}());
	})();
	global.SYSTEM_FEATURE_ES6				= !!(SYSTEM_FEATURE_ES5 && SYSTEM_FEATURE_ES6NUMBER && SYSTEM_FEATURE_ES6MATH && SYSTEM_FEATURE_ES6ARRAY && SYSTEM_FEATURE_ES6FUNCTION && SYSTEM_FEATURE_ES6OBJECT && SYSTEM_FEATURE_ES6STRING && SYSTEM_FEATURE_ES6COLLECTIONS && SYSTEM_FEATURE_ES6GENERATORS && SYSTEM_FEATURE_ES6PROMISES);

	global.SYSTEM_INFO_CPU_LITTLE_ENDIAN	= (SYSTEM_FEATURE_TYPED_ARRAYS ? (function() {
		var buffer = new ArrayBuffer(2);
		new DataView(buffer).setUint16(0, 256, true);

		return new Uint16Array(buffer)[0] === 256;
	})() : undefined);
	// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
	global.SYSTEM_INFO_CPU_BIG_ENDIAN		= typeof SYSTEM_INFO_CPU_LITTLE_ENDIAN !== 'undefined' ? !SYSTEM_INFO_CPU_LITTLE_ENDIAN : undefined;
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_INFO_CPU_ENDIANNESS		= typeof SYSTEM_INFO_CPU_LITTLE_ENDIAN !== 'undefined' ? (SYSTEM_INFO_CPU_LITTLE_ENDIAN ? 'LE' : 'BE') : undefined;
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_INFO_CPU_CORES			= !navigator.hardwareConcurrency ? 1 : navigator.hardwareConcurrency;
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_INFO_VIDEO_ACCELERATION	= SYSTEM_FEATURE_WEBGL || SYSTEM_FEATURE_WEBGL2 ? '3D' : (SYSTEM_FEATURE_CANVAS ? '2D' : undefined);
	// noinspection JSUnusedGlobalSymbols
	global.SYSTEM_INFO_GPU					= (function() {
		if (contextWEBGL) {
			if (typeof contextWEBGL.getSupportedExtensions === 'function') {
				if (contextWEBGL.getSupportedExtensions().indexOf('WEBGL_debug_renderer_info') !== -1) {
					var dbgRenderInfo = contextWEBGL.getExtension('WEBGL_debug_renderer_info');

					if (typeof dbgRenderInfo.UNMASKED_RENDERER_WEBGL !== 'undefined') {
						return contextWEBGL.getParameter(dbgRenderInfo.UNMASKED_RENDERER_WEBGL);
					}
				}
			}
		}

		return undefined;
	})();

	// endregion

	dumpSystem();

	var $SCRIPTS = $('script');

	importScripts($SCRIPTS.getAttribute('data-main'));

	onerror = function(message, url, lineNumber) {
		global.console.log('Error: ' + message + ' in ' + url + ' at line ' + lineNumber);
	};

}(this));