(function(){
(this||window)["webpackJsonp"].registerAbsMids({
	'dojo/_base/array':92,
	'dojo/_base/lang':331,
	'dojo/_base/declare':332,
	'JBrowse/QueryParamConfigMapper':336,
	'dojo/io-query':339,
	'JBrowse/View/GranularRectLayout':344,
	'JBrowse/Util/dot-object':439,
	'dojo/_base/kernel':584,
	'dojo/has':585,
	'dojo/sniff':588,
	'dojo/_base/config':610,
	'dojo/global':621
})
})(),webpackJsonp([2],{

/***/ 331:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(584), __webpack_require__(585), __webpack_require__(588)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(dojo, has){
	// module:
	//		dojo/_base/lang

	has.add("bug-for-in-skips-shadowed", function(){
		// if true, the for-in iterator skips object properties that exist in Object's prototype (IE 6 - ?)
		for(var i in {toString: 1}){
			return 0;
		}
		return 1;
	});

	// Helper methods
	var _extraNames =
			has("bug-for-in-skips-shadowed") ?
				"hasOwnProperty.valueOf.isPrototypeOf.propertyIsEnumerable.toLocaleString.toString.constructor".split(".") : [],

		_extraLen = _extraNames.length,

		getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
			if(!context){
				if(parts[0] && dojo.scopeMap[parts[0]]) {
					// Voodoo code from the old days where "dojo" or "dijit" maps to some special object
					// rather than just window.dojo
					context = dojo.scopeMap[parts.shift()][1];
				}else{
					context = dojo.global;
				}
			}

			try{
				for(var i = 0; i < parts.length; i++){
					var p = parts[i];
					if(!(p in context)){
						if(create){
							context[p] = {};
						}else{
							return;		// return undefined
						}
					}
					context = context[p];
				}
				return context; // mixed
			}catch(e){
				// "p in context" throws an exception when context is a number, boolean, etc. rather than an object,
				// so in that corner case just return undefined (by having no return statement)
			}
		},

		opts = Object.prototype.toString,

		efficient = function(obj, offset, startWith){
			return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
		},

		_pattern = /\{([^\}]+)\}/g;

	// Module export
	var lang = {
		// summary:
		//		This module defines Javascript language extensions.

		// _extraNames: String[]
		//		Lists property names that must be explicitly processed during for-in iteration
		//		in environments that have has("bug-for-in-skips-shadowed") true.
		_extraNames:_extraNames,

		_mixin: function(dest, source, copyFunc){
			// summary:
			//		Copies/adds all properties of source to dest; returns dest.
			// dest: Object
			//		The object to which to copy/add all properties contained in source.
			// source: Object
			//		The object from which to draw all properties to copy into dest.
			// copyFunc: Function?
			//		The process used to copy/add a property in source; defaults to the Javascript assignment operator.
			// returns:
			//		dest, as modified
			// description:
			//		All properties, including functions (sometimes termed "methods"), excluding any non-standard extensions
			//		found in Object.prototype, are copied/added to dest. Copying/adding each particular property is
			//		delegated to copyFunc (if any); copyFunc defaults to the Javascript assignment operator if not provided.
			//		Notice that by default, _mixin executes a so-called "shallow copy" and aggregate types are copied/added by reference.
			var name, s, i, empty = {};
			for(name in source){
				// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
				// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
				// don't overwrite it with the toString() method that source inherited from Object.prototype
				s = source[name];
				if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
					dest[name] = copyFunc ? copyFunc(s) : s;
				}
			}

			if(has("bug-for-in-skips-shadowed")){
				if(source){
					for(i = 0; i < _extraLen; ++i){
						name = _extraNames[i];
						s = source[name];
						if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
							dest[name] = copyFunc ? copyFunc(s) : s;
						}
					}
				}
			}

			return dest; // Object
		},

		mixin: function(dest, sources){
			// summary:
			//		Copies/adds all properties of one or more sources to dest; returns dest.
			// dest: Object
			//		The object to which to copy/add all properties contained in source. If dest is falsy, then
			//		a new object is manufactured before copying/adding properties begins.
			// sources: Object...
			//		One of more objects from which to draw all properties to copy into dest. sources are processed
			//		left-to-right and if more than one of these objects contain the same property name, the right-most
			//		value "wins".
			// returns: Object
			//		dest, as modified
			// description:
			//		All properties, including functions (sometimes termed "methods"), excluding any non-standard extensions
			//		found in Object.prototype, are copied/added from sources to dest. sources are processed left to right.
			//		The Javascript assignment operator is used to copy/add each property; therefore, by default, mixin
			//		executes a so-called "shallow copy" and aggregate types are copied/added by reference.
			// example:
			//		make a shallow copy of an object
			//	|	var copy = lang.mixin({}, source);
			// example:
			//		many class constructors often take an object which specifies
			//		values to be configured on the object. In this case, it is
			//		often simplest to call `lang.mixin` on the `this` object:
			//	|	declare("acme.Base", null, {
			//	|		constructor: function(properties){
			//	|			// property configuration:
			//	|			lang.mixin(this, properties);
			//	|
			//	|			console.log(this.quip);
			//	|			//	...
			//	|		},
			//	|		quip: "I wasn't born yesterday, you know - I've seen movies.",
			//	|		// ...
			//	|	});
			//	|
			//	|	// create an instance of the class and configure it
			//	|	var b = new acme.Base({quip: "That's what it does!" });
			// example:
			//		copy in properties from multiple objects
			//	|	var flattened = lang.mixin(
			//	|		{
			//	|			name: "Frylock",
			//	|			braces: true
			//	|		},
			//	|		{
			//	|			name: "Carl Brutanananadilewski"
			//	|		}
			//	|	);
			//	|
			//	|	// will print "Carl Brutanananadilewski"
			//	|	console.log(flattened.name);
			//	|	// will print "true"
			//	|	console.log(flattened.braces);

			if(!dest){ dest = {}; }
			for(var i = 1, l = arguments.length; i < l; i++){
				lang._mixin(dest, arguments[i]);
			}
			return dest; // Object
		},

		setObject: function(name, value, context){
			// summary:
			//		Set a property from a dot-separated string, such as "A.B.C"
			// description:
			//		Useful for longer api chains where you have to test each object in
			//		the chain, or when you have an object reference in string format.
			//		Objects are created as needed along `path`. Returns the passed
			//		value if setting is successful or `undefined` if not.
			// name: String
			//		Path to a property, in the form "A.B.C".
			// value: anything
			//		value or object to place at location given by name
			// context: Object?
			//		Optional. Object to use as root of path. Defaults to
			//		`dojo.global`.
			// example:
			//		set the value of `foo.bar.baz`, regardless of whether
			//		intermediate objects already exist:
			//	| lang.setObject("foo.bar.baz", value);
			// example:
			//		without `lang.setObject`, we often see code like this:
			//	| // ensure that intermediate objects are available
			//	| if(!obj["parent"]){ obj.parent = {}; }
			//	| if(!obj.parent["child"]){ obj.parent.child = {}; }
			//	| // now we can safely set the property
			//	| obj.parent.child.prop = "some value";
			//		whereas with `lang.setObject`, we can shorten that to:
			//	| lang.setObject("parent.child.prop", "some value", obj);

			var parts = name.split("."), p = parts.pop(), obj = getProp(parts, true, context);
			return obj && p ? (obj[p] = value) : undefined; // Object
		},

		getObject: function(name, create, context){
			// summary:
			//		Get a property from a dot-separated string, such as "A.B.C"
			// description:
			//		Useful for longer api chains where you have to test each object in
			//		the chain, or when you have an object reference in string format.
			// name: String
			//		Path to an property, in the form "A.B.C".
			// create: Boolean?
			//		Optional. Defaults to `false`. If `true`, Objects will be
			//		created at any point along the 'path' that is undefined.
			// context: Object?
			//		Optional. Object to use as root of path. Defaults to
			//		'dojo.global'. Null may be passed.
			return !name ? context : getProp(name.split("."), create, context); // Object
		},

		exists: function(name, obj){
			// summary:
			//		determine if an object supports a given method
			// description:
			//		useful for longer api chains where you have to test each object in
			//		the chain. Useful for object and method detection.
			// name: String
			//		Path to an object, in the form "A.B.C".
			// obj: Object?
			//		Object to use as root of path. Defaults to
			//		'dojo.global'. Null may be passed.
			// example:
			//	| // define an object
			//	| var foo = {
			//	|		bar: { }
			//	| };
			//	|
			//	| // search the global scope
			//	| lang.exists("foo.bar"); // true
			//	| lang.exists("foo.bar.baz"); // false
			//	|
			//	| // search from a particular scope
			//	| lang.exists("bar", foo); // true
			//	| lang.exists("bar.baz", foo); // false
			return lang.getObject(name, false, obj) !== undefined; // Boolean
		},

		// Crockford (ish) functions

		isString: function(it){
			// summary:
			//		Return true if it is a String
			// it: anything
			//		Item to test.
			return (typeof it == "string" || it instanceof String); // Boolean
		},

		isArray: Array.isArray || function(it){
			// summary:
			//		Return true if it is an Array.
			// it: anything
			//		Item to test.
			return opts.call(it) == "[object Array]"; // Boolean
		},

		isFunction: function(it){
			// summary:
			//		Return true if it is a Function
			// it: anything
			//		Item to test.
			return opts.call(it) === "[object Function]";
		},

		isObject: function(it){
			// summary:
			//		Returns true if it is a JavaScript object (or an Array, a Function
			//		or null)
			// it: anything
			//		Item to test.
			return it !== undefined &&
				(it === null || typeof it == "object" || lang.isArray(it) || lang.isFunction(it)); // Boolean
		},

		isArrayLike: function(it){
			// summary:
			//		similar to isArray() but more permissive
			// it: anything
			//		Item to test.
			// returns:
			//		If it walks like a duck and quacks like a duck, return `true`
			// description:
			//		Doesn't strongly test for "arrayness".  Instead, settles for "isn't
			//		a string or number and has a length property". Arguments objects
			//		and DOM collections will return true when passed to
			//		isArrayLike(), but will return false when passed to
			//		isArray().
			return !!it && // Boolean
				// keep out built-in constructors (Number, String, ...) which have length
				// properties
				!lang.isString(it) && !lang.isFunction(it) &&
				!(it.tagName && it.tagName.toLowerCase() == 'form') &&
				(lang.isArray(it) || isFinite(it.length));
		},

		isAlien: function(it){
			// summary:
			//		Returns true if it is a built-in function or some other kind of
			//		oddball that *should* report as a function but doesn't
			return it && !lang.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
		},

		extend: function(ctor, props){
			// summary:
			//		Adds all properties and methods of props to constructor's
			//		prototype, making them available to all instances created with
			//		constructor.
			// ctor: Object
			//		Target constructor to extend.
			// props: Object
			//		One or more objects to mix into ctor.prototype
			for(var i=1, l=arguments.length; i<l; i++){
				lang._mixin(ctor.prototype, arguments[i]);
			}
			return ctor; // Object
		},

		_hitchArgs: function(scope, method){
			var pre = lang._toArray(arguments, 2);
			var named = lang.isString(method);
			return function(){
				// arrayify arguments
				var args = lang._toArray(arguments);
				// locate our method
				var f = named ? (scope||dojo.global)[method] : method;
				// invoke with collected args
				return f && f.apply(scope || this, pre.concat(args)); // mixed
			}; // Function
		},

		hitch: function(scope, method){
			// summary:
			//		Returns a function that will only ever execute in the given scope.
			//		This allows for easy use of object member functions
			//		in callbacks and other places in which the "this" keyword may
			//		otherwise not reference the expected scope.
			//		Any number of default positional arguments may be passed as parameters
			//		beyond "method".
			//		Each of these values will be used to "placehold" (similar to curry)
			//		for the hitched function.
			// scope: Object
			//		The scope to use when method executes. If method is a string,
			//		scope is also the object containing method.
			// method: Function|String...
			//		A function to be hitched to scope, or the name of the method in
			//		scope to be hitched.
			// example:
			//	|	lang.hitch(foo, "bar")();
			//		runs foo.bar() in the scope of foo
			// example:
			//	|	lang.hitch(foo, myFunction);
			//		returns a function that runs myFunction in the scope of foo
			// example:
			//		Expansion on the default positional arguments passed along from
			//		hitch. Passed args are mixed first, additional args after.
			//	|	var foo = { bar: function(a, b, c){ console.log(a, b, c); } };
			//	|	var fn = lang.hitch(foo, "bar", 1, 2);
			//	|	fn(3); // logs "1, 2, 3"
			// example:
			//	|	var foo = { bar: 2 };
			//	|	lang.hitch(foo, function(){ this.bar = 10; })();
			//		execute an anonymous function in scope of foo
			if(arguments.length > 2){
				return lang._hitchArgs.apply(dojo, arguments); // Function
			}
			if(!method){
				method = scope;
				scope = null;
			}
			if(lang.isString(method)){
				scope = scope || dojo.global;
				if(!scope[method]){ throw(['lang.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
				return function(){ return scope[method].apply(scope, arguments || []); }; // Function
			}
			return !scope ? method : function(){ return method.apply(scope, arguments || []); }; // Function
		},

		delegate: (function(){
			// boodman/crockford delegation w/ cornford optimization
			function TMP(){}
			return function(obj, props){
				TMP.prototype = obj;
				var tmp = new TMP();
				TMP.prototype = null;
				if(props){
					lang._mixin(tmp, props);
				}
				return tmp; // Object
			};
		})(),
		/*=====
		delegate: function(obj, props){
			// summary:
			//		Returns a new object which "looks" to obj for properties which it
			//		does not have a value for. Optionally takes a bag of properties to
			//		seed the returned object with initially.
			// description:
			//		This is a small implementation of the Boodman/Crockford delegation
			//		pattern in JavaScript. An intermediate object constructor mediates
			//		the prototype chain for the returned object, using it to delegate
			//		down to obj for property lookup when object-local lookup fails.
			//		This can be thought of similarly to ES4's "wrap", save that it does
			//		not act on types but rather on pure objects.
			// obj: Object
			//		The object to delegate to for properties not found directly on the
			//		return object or in props.
			// props: Object...
			//		an object containing properties to assign to the returned object
			// returns:
			//		an Object of anonymous type
			// example:
			//	|	var foo = { bar: "baz" };
			//	|	var thinger = lang.delegate(foo, { thud: "xyzzy"});
			//	|	thinger.bar == "baz"; // delegated to foo
			//	|	foo.thud == undefined; // by definition
			//	|	thinger.thud == "xyzzy"; // mixed in from props
			//	|	foo.bar = "thonk";
			//	|	thinger.bar == "thonk"; // still delegated to foo's bar
		},
		=====*/

		_toArray: has("ie") ?
			(function(){
				function slow(obj, offset, startWith){
					var arr = startWith||[];
					for(var x = offset || 0; x < obj.length; x++){
						arr.push(obj[x]);
					}
					return arr;
				}
				return function(obj){
					return ((obj.item) ? slow : efficient).apply(this, arguments);
				};
			})() : efficient,
		/*=====
		 _toArray: function(obj, offset, startWith){
			 // summary:
			 //		Converts an array-like object (i.e. arguments, DOMCollection) to an
			 //		array. Returns a new Array with the elements of obj.
			 // obj: Object
			 //		the object to "arrayify". We expect the object to have, at a
			 //		minimum, a length property which corresponds to integer-indexed
			 //		properties.
			 // offset: Number?
			 //		the location in obj to start iterating from. Defaults to 0.
			 //		Optional.
			 // startWith: Array?
			 //		An array to pack with the properties of obj. If provided,
			 //		properties in obj are appended at the end of startWith and
			 //		startWith is the returned array.
		 },
		 =====*/

		partial: function(/*Function|String*/ method /*, ...*/){
			// summary:
			//		similar to hitch() except that the scope object is left to be
			//		whatever the execution context eventually becomes.
			// description:
			//		Calling lang.partial is the functional equivalent of calling:
			//		|	lang.hitch(null, funcName, ...);
			// method:
			//		The function to "wrap"
			var arr = [ null ];
			return lang.hitch.apply(dojo, arr.concat(lang._toArray(arguments))); // Function
		},

		clone: function(/*anything*/ src){
			// summary:
			//		Clones objects (including DOM nodes) and all children.
			//		Warning: do not clone cyclic structures.
			// src:
			//		The object to clone
			if(!src || typeof src != "object" || lang.isFunction(src)){
				// null, undefined, any non-object, or function
				return src;	// anything
			}
			if(src.nodeType && "cloneNode" in src){
				// DOM Node
				return src.cloneNode(true); // Node
			}
			if(src instanceof Date){
				// Date
				return new Date(src.getTime());	// Date
			}
			if(src instanceof RegExp){
				// RegExp
				return new RegExp(src);   // RegExp
			}
			var r, i, l;
			if(lang.isArray(src)){
				// array
				r = [];
				for(i = 0, l = src.length; i < l; ++i){
					if(i in src){
						r[i] = lang.clone(src[i]);
					}
				}
				// we don't clone functions for performance reasons
				//		}else if(d.isFunction(src)){
				//			// function
				//			r = function(){ return src.apply(this, arguments); };
			}else{
				// generic objects
				r = src.constructor ? new src.constructor() : {};
			}
			return lang._mixin(r, src, lang.clone);
		},


		trim: String.prototype.trim ?
			function(str){ return str.trim(); } :
			function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); },
		/*=====
		 trim: function(str){
			 // summary:
			 //		Trims whitespace from both sides of the string
			 // str: String
			 //		String to be trimmed
			 // returns: String
			 //		Returns the trimmed string
			 // description:
			 //		This version of trim() was selected for inclusion into the base due
			 //		to its compact size and relatively good performance
			 //		(see [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript)
			 //		Uses String.prototype.trim instead, if available.
			 //		The fastest but longest version of this function is located at
			 //		lang.string.trim()
		 },
		 =====*/

		replace: function(tmpl, map, pattern){
			// summary:
			//		Performs parameterized substitutions on a string. Throws an
			//		exception if any parameter is unmatched.
			// tmpl: String
			//		String to be used as a template.
			// map: Object|Function
			//		If an object, it is used as a dictionary to look up substitutions.
			//		If a function, it is called for every substitution with following parameters:
			//		a whole match, a name, an offset, and the whole template
			//		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
			//		for more details).
			// pattern: RegEx?
			//		Optional regular expression objects that overrides the default pattern.
			//		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
			//		which matches patterns like that: "{xxx}", where "xxx" is any sequence
			//		of characters, which doesn't include "}".
			// returns: String
			//		Returns the substituted string.
			// example:
			//	|	// uses a dictionary for substitutions:
			//	|	lang.replace("Hello, {name.first} {name.last} AKA {nick}!",
			//	|		{
			//	|			nick: "Bob",
			//	|			name: {
			//	|				first:	"Robert",
			//	|				middle: "X",
			//	|				last:		"Cringely"
			//	|			}
			//	|		});
			//	|	// returns: Hello, Robert Cringely AKA Bob!
			// example:
			//	|	// uses an array for substitutions:
			//	|	lang.replace("Hello, {0} {2}!",
			//	|		["Robert", "X", "Cringely"]);
			//	|	// returns: Hello, Robert Cringely!
			// example:
			//	|	// uses a function for substitutions:
			//	|	function sum(a){
			//	|		var t = 0;
			//	|		arrayforEach(a, function(x){ t += x; });
			//	|		return t;
			//	|	}
			//	|	lang.replace(
			//	|		"{count} payments averaging {avg} USD per payment.",
			//	|		lang.hitch(
			//	|			{ payments: [11, 16, 12] },
			//	|			function(_, key){
			//	|				switch(key){
			//	|					case "count": return this.payments.length;
			//	|					case "min":		return Math.min.apply(Math, this.payments);
			//	|					case "max":		return Math.max.apply(Math, this.payments);
			//	|					case "sum":		return sum(this.payments);
			//	|					case "avg":		return sum(this.payments) / this.payments.length;
			//	|				}
			//	|			}
			//	|		)
			//	|	);
			//	|	// prints: 3 payments averaging 13 USD per payment.
			// example:
			//	|	// uses an alternative PHP-like pattern for substitutions:
			//	|	lang.replace("Hello, ${0} ${2}!",
			//	|		["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
			//	|	// returns: Hello, Robert Cringely!

			return tmpl.replace(pattern || _pattern, lang.isFunction(map) ?
				map : function(_, k){ return lang.getObject(k, false, map); });
		}
	};

	has("extend-dojo") && lang.mixin(dojo, lang);

	return lang;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 332:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(584), __webpack_require__(585), __webpack_require__(331)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(dojo, has, lang){
	// module:
	//		dojo/_base/declare

	var mix = lang.mixin, op = Object.prototype, opts = op.toString,
		xtor, counter = 0, cname = "constructor";

	if(!has("csp-restrictions")){
		// 'new Function()' is preferable when available since it does not create a closure
		xtor = new Function;
	}else{
		xtor = function(){};
	}

	function err(msg, cls){ throw new Error("declare" + (cls ? " " + cls : "") + ": " + msg); }

	// C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
	function c3mro(bases, className){
		var result = [], roots = [{cls: 0, refs: []}], nameMap = {}, clsCount = 1,
			l = bases.length, i = 0, j, lin, base, top, proto, rec, name, refs;

		// build a list of bases naming them if needed
		for(; i < l; ++i){
			base = bases[i];
			if(!base){
				err("mixin #" + i + " is unknown. Did you use dojo.require to pull it in?", className);
			}else if(opts.call(base) != "[object Function]"){
				err("mixin #" + i + " is not a callable constructor.", className);
			}
			lin = base._meta ? base._meta.bases : [base];
			top = 0;
			// add bases to the name map
			for(j = lin.length - 1; j >= 0; --j){
				proto = lin[j].prototype;
				if(!proto.hasOwnProperty("declaredClass")){
					proto.declaredClass = "uniqName_" + (counter++);
				}
				name = proto.declaredClass;
				if(!nameMap.hasOwnProperty(name)){
					nameMap[name] = {count: 0, refs: [], cls: lin[j]};
					++clsCount;
				}
				rec = nameMap[name];
				if(top && top !== rec){
					rec.refs.push(top);
					++top.count;
				}
				top = rec;
			}
			++top.count;
			roots[0].refs.push(top);
		}

		// remove classes without external references recursively
		while(roots.length){
			top = roots.pop();
			result.push(top.cls);
			--clsCount;
			// optimization: follow a single-linked chain
			while(refs = top.refs, refs.length == 1){
				top = refs[0];
				if(!top || --top.count){
					// branch or end of chain => do not end to roots
					top = 0;
					break;
				}
				result.push(top.cls);
				--clsCount;
			}
			if(top){
				// branch
				for(i = 0, l = refs.length; i < l; ++i){
					top = refs[i];
					if(!--top.count){
						roots.push(top);
					}
				}
			}
		}
		if(clsCount){
			err("can't build consistent linearization", className);
		}

		// calculate the superclass offset
		base = bases[0];
		result[0] = base ?
			base._meta && base === result[result.length - base._meta.bases.length] ?
				base._meta.bases.length : 1 : 0;

		return result;
	}

	function inherited(args, a, f, g){
		var name, chains, bases, caller, meta, base, proto, opf, pos,
			cache = this._inherited = this._inherited || {};

		// crack arguments
		if(typeof args === "string"){
			name = args;
			args = a;
			a = f;
			f = g;
		}

		if(typeof args === "function"){
			// support strict mode
			caller = args;
			args = a;
			a = f;
		}else{
			try{
				caller = args.callee;
			}catch (e){
				if(e instanceof TypeError){
					// caller was defined in a strict-mode context
					err("strict mode inherited() requires the caller function to be passed before arguments", this.declaredClass);
				}else{
					throw e;
				}
			}
		}

		name = name || caller.nom;
		if(!name){
			err("can't deduce a name to call inherited()", this.declaredClass);
		}
		f = g = 0;

		meta = this.constructor._meta;
		bases = meta.bases;

		pos = cache.p;
		if(name != cname){
			// method
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				base = bases[0];
				meta = base._meta;
				if(meta.hidden[name] !== caller){
					// error detection
					chains = meta.chains;
					if(chains && typeof chains[name] == "string"){
						err("calling chained method with inherited: " + name, this.declaredClass);
					}
					// find caller
					do{
						meta = base._meta;
						proto = base.prototype;
						if(meta && (proto[name] === caller && proto.hasOwnProperty(name) || meta.hidden[name] === caller)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
					pos = base ? pos : -1;
				}
			}
			// find next
			base = bases[++pos];
			if(base){
				proto = base.prototype;
				if(base._meta && proto.hasOwnProperty(name)){
					f = proto[name];
				}else{
					opf = op[name];
					do{
						proto = base.prototype;
						f = proto[name];
						if(f && (base._meta ? proto.hasOwnProperty(name) : f !== opf)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
				}
			}
			f = base && f || op[name];
		}else{
			// constructor
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				meta = bases[0]._meta;
				if(meta && meta.ctor !== caller){
					// error detection
					chains = meta.chains;
					if(!chains || chains.constructor !== "manual"){
						err("calling chained constructor with inherited", this.declaredClass);
					}
					// find caller
					while(base = bases[++pos]){ // intentional assignment
						meta = base._meta;
						if(meta && meta.ctor === caller){
							break;
						}
					}
					pos = base ? pos : -1;
				}
			}
			// find next
			while(base = bases[++pos]){	// intentional assignment
				meta = base._meta;
				f = meta ? meta.ctor : base;
				if(f){
					break;
				}
			}
			f = base && f;
		}

		// cache the found super method
		cache.c = f;
		cache.p = pos;

		// now we have the result
		if(f){
			return a === true ? f : f.apply(this, a || args);
		}
		// intentionally no return if a super method was not found
	}

	function getInherited(name, args, a){
		if(typeof name === "string"){
			if (typeof args === "function") {
				return this.__inherited(name, args, a, true);
			}
			return this.__inherited(name, args, true);
		}
		else if (typeof name === "function") {
			return this.__inherited(name, args, true);
		}
		return this.__inherited(name, true);
	}

	function inherited__debug(args, a1, a2, a3){
		var f = this.getInherited(args, a1, a2);
		if(f){
			return f.apply(this, a3 || a2 || a1 || args);
		}
		// intentionally no return if a super method was not found
	}

	var inheritedImpl = dojo.config.isDebug ? inherited__debug : inherited;

	// emulation of "instanceof"
	function isInstanceOf(cls){
		var bases = this.constructor._meta.bases;
		for(var i = 0, l = bases.length; i < l; ++i){
			if(bases[i] === cls){
				return true;
			}
		}
		return this instanceof cls;
	}

	function mixOwn(target, source){
		// add props adding metadata for incoming functions skipping a constructor
		for(var name in source){
			if(name != cname && source.hasOwnProperty(name)){
				target[name] = source[name];
			}
		}
		if(has("bug-for-in-skips-shadowed")){
			for(var extraNames= lang._extraNames, i= extraNames.length; i;){
				name = extraNames[--i];
				if(name != cname && source.hasOwnProperty(name)){
					  target[name] = source[name];
				}
			}
		}
	}

	// implementation of safe mixin function
	function safeMixin(target, source){
		// summary:
		//		Mix in properties skipping a constructor and decorating functions
		//		like it is done by declare().
		// target: Object
		//		Target object to accept new properties.
		// source: Object
		//		Source object for new properties.
		// description:
		//		This function is used to mix in properties like lang.mixin does,
		//		but it skips a constructor property and decorates functions like
		//		declare() does.
		//
		//		It is meant to be used with classes and objects produced with
		//		declare. Functions mixed in with dojo.safeMixin can use
		//		this.inherited() like normal methods.
		//
		//		This function is used to implement extend() method of a constructor
		//		produced with declare().
		//
		// example:
		//	|	var A = declare(null, {
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = declare(A, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m1");
		//	|		}
		//	|	});
		//	|	B.extend({
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	dojo.safeMixin(x, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m1");
		//	|		},
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m2");
		//	|		}
		//	|	});
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m1
		//	|	// B.m1
		//	|	// X.m1

		var name, t;
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		if(has("bug-for-in-skips-shadowed") && source){
			for(var extraNames= lang._extraNames, i= extraNames.length; i;){
				name = extraNames[--i];
				t = source[name];
				if((t !== op[name] || !(name in op)) && name != cname){
					if(opts.call(t) == "[object Function]"){
						// non-trivial function method => attach its name
						  t.nom = name;
					}
					target[name] = t;
				}
			}
		}
		return target;
	}

	function extend(source){
		declare.safeMixin(this.prototype, source);
		return this;
	}

	function createSubclass(mixins, props){
		// crack parameters
		if(!(mixins instanceof Array || typeof mixins === 'function')){
			props = mixins;
			mixins = undefined;
		}

		props = props || {};
		mixins = mixins || [];

		return declare([this].concat(mixins), props);
	}

	// chained constructor compatible with the legacy declare()
	function chainedConstructor(bases, ctorSpecial){
		return function(){
			var a = arguments, args = a, a0 = a[0], f, i, m,
				l = bases.length, preArgs;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original declare()
			// 1) call two types of the preamble
			if(ctorSpecial && (a0 && a0.preamble || this.preamble)){
				// full blown ritual
				preArgs = new Array(bases.length);
				// prepare parameters
				preArgs[0] = a;
				for(i = 0;;){
					// process the preamble of the 1st argument
					a0 = a[0];
					if(a0){
						f = a0.preamble;
						if(f){
							a = f.apply(this, a) || a;
						}
					}
					// process the preamble of this class
					f = bases[i].prototype;
					f = f.hasOwnProperty("preamble") && f.preamble;
					if(f){
						a = f.apply(this, a) || a;
					}
					// one peculiarity of the preamble:
					// it is called if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
					if(++i == l){
						break;
					}
					preArgs[i] = a;
				}
			}
			// 2) call all non-trivial constructors using prepared arguments
			for(i = l - 1; i >= 0; --i){
				f = bases[i];
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, preArgs ? preArgs[i] : a);
				}
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, args);
			}
		};
	}


	// chained constructor compatible with the legacy declare()
	function singleConstructor(ctor, ctorSpecial){
		return function(){
			var a = arguments, t = a, a0 = a[0], f;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original declare()
			// 1) call two types of the preamble
			if(ctorSpecial){
				// full blown ritual
				if(a0){
					// process the preamble of the 1st argument
					f = a0.preamble;
					if(f){
						t = f.apply(this, t) || t;
					}
				}
				f = this.preamble;
				if(f){
					// process the preamble of this class
					f.apply(this, t);
					// one peculiarity of the preamble:
					// it is called even if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
				}
			}
			// 2) call a constructor
			if(ctor){
				ctor.apply(this, a);
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	// plain vanilla constructor (can use inherited() to call its base constructor)
	function simpleConstructor(bases){
		return function(){
			var a = arguments, i = 0, f, m;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original declare()
			// 1) do not call the preamble
			// 2) call the top constructor (it can use this.inherited())
			for(; f = bases[i]; ++i){ // intentional assignment
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, a);
					break;
				}
			}
			// 3) call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	function chain(name, bases, reversed){
		return function(){
			var b, m, f, i = 0, step = 1;
			if(reversed){
				i = bases.length - 1;
				step = -1;
			}
			for(; b = bases[i]; i += step){ // intentional assignment
				m = b._meta;
				f = (m ? m.hidden : b.prototype)[name];
				if(f){
					f.apply(this, arguments);
				}
			}
		};
	}

	// forceNew(ctor)
	// return a new object that inherits from ctor.prototype but
	// without actually running ctor on the object.
	function forceNew(ctor){
		// create object with correct prototype using a do-nothing
		// constructor
		xtor.prototype = ctor.prototype;
		var t = new xtor;
		xtor.prototype = null;	// clean up
		return t;
	}

	// applyNew(args)
	// just like 'new ctor()' except that the constructor and its arguments come
	// from args, which must be an array or an arguments object
	function applyNew(args){
		// create an object with ctor's prototype but without
		// calling ctor on it.
		var ctor = args.callee, t = forceNew(ctor);
		// execute the real constructor on the new object
		ctor.apply(t, args);
		return t;
	}

	function declare(className, superclass, props){
		// summary:
		//		Create a feature-rich constructor from compact notation.
		// className: String?
		//		The optional name of the constructor (loosely, a "class")
		//		stored in the "declaredClass" property in the created prototype.
		//		It will be used as a global name for a created constructor.
		// superclass: Function|Function[]
		//		May be null, a Function, or an Array of Functions. This argument
		//		specifies a list of bases (the left-most one is the most deepest
		//		base).
		// props: Object
		//		An object whose properties are copied to the created prototype.
		//		Add an instance-initialization function by making it a property
		//		named "constructor".
		// returns: dojo/_base/declare.__DeclareCreatedObject
		//		New constructor function.
		// description:
		//		Create a constructor using a compact notation for inheritance and
		//		prototype extension.
		//
		//		Mixin ancestors provide a type of multiple inheritance.
		//		Prototypes of mixin ancestors are copied to the new class:
		//		changes to mixin prototypes will not affect classes to which
		//		they have been mixed in.
		//
		//		Ancestors can be compound classes created by this version of
		//		declare(). In complex cases all base classes are going to be
		//		linearized according to C3 MRO algorithm
		//		(see http://www.python.org/download/releases/2.3/mro/ for more
		//		details).
		//
		//		"className" is cached in "declaredClass" property of the new class,
		//		if it was supplied. The immediate super class will be cached in
		//		"superclass" property of the new class.
		//
		//		Methods in "props" will be copied and modified: "nom" property
		//		(the declared name of the method) will be added to all copied
		//		functions to help identify them for the internal machinery. Be
		//		very careful, while reusing methods: if you use the same
		//		function under different names, it can produce errors in some
		//		cases.
		//
		//		It is possible to use constructors created "manually" (without
		//		declare()) as bases. They will be called as usual during the
		//		creation of an instance, their methods will be chained, and even
		//		called by "this.inherited()".
		//
		//		Special property "-chains-" governs how to chain methods. It is
		//		a dictionary, which uses method names as keys, and hint strings
		//		as values. If a hint string is "after", this method will be
		//		called after methods of its base classes. If a hint string is
		//		"before", this method will be called before methods of its base
		//		classes.
		//
		//		If "constructor" is not mentioned in "-chains-" property, it will
		//		be chained using the legacy mode: using "after" chaining,
		//		calling preamble() method before each constructor, if available,
		//		and calling postscript() after all constructors were executed.
		//		If the hint is "after", it is chained as a regular method, but
		//		postscript() will be called after the chain of constructors.
		//		"constructor" cannot be chained "before", but it allows
		//		a special hint string: "manual", which means that constructors
		//		are not going to be chained in any way, and programmer will call
		//		them manually using this.inherited(). In the latter case
		//		postscript() will be called after the construction.
		//
		//		All chaining hints are "inherited" from base classes and
		//		potentially can be overridden. Be very careful when overriding
		//		hints! Make sure that all chained methods can work in a proposed
		//		manner of chaining.
		//
		//		Once a method was chained, it is impossible to unchain it. The
		//		only exception is "constructor". You don't need to define a
		//		method in order to supply a chaining hint.
		//
		//		If a method is chained, it cannot use this.inherited() because
		//		all other methods in the hierarchy will be called automatically.
		//
		//		Usually constructors and initializers of any kind are chained
		//		using "after" and destructors of any kind are chained as
		//		"before". Note that chaining assumes that chained methods do not
		//		return any value: any returned value will be discarded.
		//
		// example:
		//	|	declare("my.classes.bar", my.classes.foo, {
		//	|		// properties to be added to the class prototype
		//	|		someValue: 2,
		//	|		// initialization function
		//	|		constructor: function(){
		//	|			this.myComplicatedObject = new ReallyComplicatedObject();
		//	|		},
		//	|		// other functions
		//	|		someMethod: function(){
		//	|			doStuff();
		//	|		}
		//	|	});
		//
		// example:
		//	|	var MyBase = declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass1 = declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass2 = declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyDiamond = declare([MyClass1, MyClass2], {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//
		// example:
		//	|	var F = function(){ console.log("raw constructor"); };
		//	|	F.prototype.method = function(){
		//	|		console.log("raw method");
		//	|	};
		//	|	var A = declare(F, {
		//	|		constructor: function(){
		//	|			console.log("A.constructor");
		//	|		},
		//	|		method: function(){
		//	|			console.log("before calling F.method...");
		//	|			this.inherited(arguments);
		//	|			console.log("...back in A");
		//	|		}
		//	|	});
		//	|	new A().method();
		//	|	// will print:
		//	|	// raw constructor
		//	|	// A.constructor
		//	|	// before calling F.method...
		//	|	// raw method
		//	|	// ...back in A
		//
		// example:
		//	|	var A = declare(null, {
		//	|		"-chains-": {
		//	|			destroy: "before"
		//	|		}
		//	|	});
		//	|	var B = declare(A, {
		//	|		constructor: function(){
		//	|			console.log("B.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("B.destroy");
		//	|		}
		//	|	});
		//	|	var C = declare(B, {
		//	|		constructor: function(){
		//	|			console.log("C.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("C.destroy");
		//	|		}
		//	|	});
		//	|	new C().destroy();
		//	|	// prints:
		//	|	// B.constructor
		//	|	// C.constructor
		//	|	// C.destroy
		//	|	// B.destroy
		//
		// example:
		//	|	var A = declare(null, {
		//	|		"-chains-": {
		//	|			constructor: "manual"
		//	|		}
		//	|	});
		//	|	var B = declare(A, {
		//	|		constructor: function(){
		//	|			// ...
		//	|			// call the base constructor with new parameters
		//	|			this.inherited(arguments, [1, 2, 3]);
		//	|			// ...
		//	|		}
		//	|	});
		//
		// example:
		//	|	var A = declare(null, {
		//	|		"-chains-": {
		//	|			m1: "before"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = declare(A, {
		//	|		"-chains-": {
		//	|			m2: "after"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("B.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	x.m1();
		//	|	// prints:
		//	|	// B.m1
		//	|	// A.m1
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m2
		//	|	// B.m2

		// crack parameters
		if(typeof className != "string"){
			props = superclass;
			superclass = className;
			className = "";
		}
		props = props || {};

		var proto, i, t, ctor, name, bases, chains, mixins = 1, parents = superclass;

		// build a prototype
		if(opts.call(superclass) == "[object Array]"){
			// C3 MRO
			bases = c3mro(superclass, className);
			t = bases[0];
			mixins = bases.length - t;
			superclass = bases[mixins];
		}else{
			bases = [0];
			if(superclass){
				if(opts.call(superclass) == "[object Function]"){
					t = superclass._meta;
					bases = bases.concat(t ? t.bases : superclass);
				}else{
					err("base class is not a callable constructor.", className);
				}
			}else if(superclass !== null){
				err("unknown base class. Did you use dojo.require to pull it in?", className);
			}
		}
		if(superclass){
			for(i = mixins - 1;; --i){
				proto = forceNew(superclass);
				if(!i){
					// stop if nothing to add (the last base)
					break;
				}
				// mix in properties
				t = bases[i];
				(t._meta ? mixOwn : mix)(proto, t.prototype);
				// chain in new constructor
				if (has("csp-restrictions")) {
					ctor = function () {};
				}
				else {
					ctor = new Function;
				}
				ctor.superclass = superclass;
				ctor.prototype = proto;
				superclass = proto.constructor = ctor;
			}
		}else{
			proto = {};
		}
		// add all properties
		declare.safeMixin(proto, props);
		// add constructor
		t = props.constructor;
		if(t !== op.constructor){
			t.nom = cname;
			proto.constructor = t;
		}

		// collect chains and flags
		for(i = mixins - 1; i; --i){ // intentional assignment
			t = bases[i]._meta;
			if(t && t.chains){
				chains = mix(chains || {}, t.chains);
			}
		}
		if(proto["-chains-"]){
			chains = mix(chains || {}, proto["-chains-"]);
		}

		if(superclass && superclass.prototype && superclass.prototype["-chains-"]) {
			chains = mix(chains || {}, superclass.prototype["-chains-"]);
		}

		// build ctor
		t = !chains || !chains.hasOwnProperty(cname);
		bases[0] = ctor = (chains && chains.constructor === "manual") ? simpleConstructor(bases) :
			(bases.length == 1 ? singleConstructor(props.constructor, t) : chainedConstructor(bases, t));

		// add meta information to the constructor
		ctor._meta  = {bases: bases, hidden: props, chains: chains,
			parents: parents, ctor: props.constructor};
		ctor.superclass = superclass && superclass.prototype;
		ctor.extend = extend;
		ctor.createSubclass = createSubclass;
		ctor.prototype = proto;
		proto.constructor = ctor;

		// add "standard" methods to the prototype
		proto.getInherited = getInherited;
		proto.isInstanceOf = isInstanceOf;
		proto.inherited    = inheritedImpl;
		proto.__inherited  = inherited;

		// add name if specified
		if(className){
			proto.declaredClass = className;
			lang.setObject(className, ctor);
		}

		// build chains and add them to the prototype
		if(chains){
			for(name in chains){
				if(proto[name] && typeof chains[name] == "string" && name != cname){
					t = proto[name] = chain(name, bases, chains[name] === "after");
					t.nom = name;
				}
			}
		}
		// chained methods do not return values
		// no need to chain "invisible" functions

		return ctor;	// Function
	}

	/*=====
	declare.__DeclareCreatedObject = {
		// summary:
		//		dojo/_base/declare() returns a constructor `C`.   `new C()` returns an Object with the following
		//		methods, in addition to the methods and properties specified via the arguments passed to declare().

		inherited: function(name, caller, args, newArgs){
			// summary:
			//		Calls a super method.
			// name: String?
			//		The optional method name. Should be the same as the caller's
			//		name. Usually "name" is specified in complex dynamic cases, when
			//		the calling method was dynamically added, undecorated by
			//		declare(), and it cannot be determined.
			// caller: Function?
			//		The reference to the calling function. Required only if the
			//		call to "this.inherited" occurs from within strict-mode code.
			//		If the caller is omitted within strict-mode code, an error will
			//		be thrown.
			//		The best way to obtain a reference to the calling function is to
			//		use a named function expression (i.e. place a function name
			//		after the "function" keyword and before the open paren, as in
			//		"function fn(a, b)"). If the function is parsed as an expression
			//		and not a statement (i.e. it's not by itself on its own line),
			//		the function name will only be accessible as an identifier from
			//		within the body of the function.
			// args: Arguments
			//		The caller supply this argument, which should be the original
			//		"arguments".
			// newArgs: Object?
			//		If "true", the found function will be returned without
			//		executing it.
			//		If Array, it will be used to call a super method. Otherwise
			//		"args" will be used.
			// returns:
			//		Whatever is returned by a super method, or a super method itself,
			//		if "true" was specified as newArgs.
			// description:
			//		This method is used inside method of classes produced with
			//		declare() to call a super method (next in the chain). It is
			//		used for manually controlled chaining. Consider using the regular
			//		chaining, because it is faster. Use "this.inherited()" only in
			//		complex cases.
			//
			//		This method cannot me called from automatically chained
			//		constructors including the case of a special (legacy)
			//		constructor chaining. It cannot be called from chained methods.
			//
			//		If "this.inherited()" cannot find the next-in-chain method, it
			//		does nothing and returns "undefined". The last method in chain
			//		can be a default method implemented in Object, which will be
			//		called last.
			//
			//		If "name" is specified, it is assumed that the method that
			//		received "args" is the parent method for this call. It is looked
			//		up in the chain list and if it is found the next-in-chain method
			//		is called. If it is not found, the first-in-chain method is
			//		called.
			//
			//		If "name" is not specified, it will be derived from the calling
			//		method (using a methoid property "nom").
			//
			// example:
			//	|	var B = declare(A, {
			//	|		method1: function(a, b, c){
			//	|			this.inherited(arguments);
			//	|		},
			//	|		method2: function(a, b){
			//	|			return this.inherited(arguments, [a + b]);
			//	|		}
			//	|	});
			//	|	// next method is not in the chain list because it is added
			//	|	// manually after the class was created.
			//	|	B.prototype.method3 = function(){
			//	|		console.log("This is a dynamically-added method.");
			//	|		this.inherited("method3", arguments);
			//	|	};
			// example:
			//	|	var B = declare(A, {
			//	|		method: function(a, b){
			//	|			var super = this.inherited(arguments, true);
			//	|			// ...
			//	|			if(!super){
			//	|				console.log("there is no super method");
			//	|				return 0;
			//	|			}
			//	|			return super.apply(this, arguments);
			//	|		}
			//	|	});
			// example:
			//	|	"use strict";
			//	|	// class is defined in strict-mode code,
			//	|	// so caller must be passed before arguments.
			//	|	var B = declare(A, {
			//	|		// using a named function expression with "fn" as the name.
			//	|		method: function fn(a, b) {
			//	|			this.inherited(fn, arguments);
			//	|		}
			//	|	});
			return	{};	// Object
		},

		getInherited: function(name, caller, args){
			// summary:
			//		Returns a super method.
			// name: String?
			//		The optional method name. Should be the same as the caller's
			//		name. Usually "name" is specified in complex dynamic cases, when
			//		the calling method was dynamically added, undecorated by
			//		declare(), and it cannot be determined.
			// caller: Function?
			//		The caller function. This is required when running in
			//		strict-mode code. A reference to the caller function
			//		can be obtained by using a named function expression
			//		(e.g. function fn(a,b) {...}).
			// args: Arguments
			//		The caller supply this argument, which should be the original
			//		"arguments".
			// returns:
			//		Returns a super method (Function) or "undefined".
			// description:
			//		This method is a convenience method for "this.inherited()".
			//		It uses the same algorithm but instead of executing a super
			//		method, it returns it, or "undefined" if not found.
			//
			// example:
			//	|	var B = declare(A, {
			//	|		method: function(a, b){
			//	|			var super = this.getInherited(arguments);
			//	|			// ...
			//	|			if(!super){
			//	|				console.log("there is no super method");
			//	|				return 0;
			//	|			}
			//	|			return super.apply(this, arguments);
			//	|		}
			//	|	});
			// example:
			//	|	"use strict;" // first line of function or file
			//	|	//...
			//	|	var B = declare(A, {
			//	|		// Using a named function expression with "fn" as the name,
			//	|		// since we're in strict mode.
			//	|		method: function fn(a, b){
			//	|			var super = this.getInherited(fn, arguments);
			//	|			if(super){
			//	|				return super.apply(this, arguments);
			//	|			}
			//	|		}
			//	|	});
			return	{};	// Object
		},

		isInstanceOf: function(cls){
			// summary:
			//		Checks the inheritance chain to see if it is inherited from this
			//		class.
			// cls: Function
			//		Class constructor.
			// returns:
			//		"true", if this object is inherited from this class, "false"
			//		otherwise.
			// description:
			//		This method is used with instances of classes produced with
			//		declare() to determine of they support a certain interface or
			//		not. It models "instanceof" operator.
			//
			// example:
			//	|	var A = declare(null, {
			//	|		// constructor, properties, and methods go here
			//	|		// ...
			//	|	});
			//	|	var B = declare(null, {
			//	|		// constructor, properties, and methods go here
			//	|		// ...
			//	|	});
			//	|	var C = declare([A, B], {
			//	|		// constructor, properties, and methods go here
			//	|		// ...
			//	|	});
			//	|	var D = declare(A, {
			//	|		// constructor, properties, and methods go here
			//	|		// ...
			//	|	});
			//	|
			//	|	var a = new A(), b = new B(), c = new C(), d = new D();
			//	|
			//	|	console.log(a.isInstanceOf(A)); // true
			//	|	console.log(b.isInstanceOf(A)); // false
			//	|	console.log(c.isInstanceOf(A)); // true
			//	|	console.log(d.isInstanceOf(A)); // true
			//	|
			//	|	console.log(a.isInstanceOf(B)); // false
			//	|	console.log(b.isInstanceOf(B)); // true
			//	|	console.log(c.isInstanceOf(B)); // true
			//	|	console.log(d.isInstanceOf(B)); // false
			//	|
			//	|	console.log(a.isInstanceOf(C)); // false
			//	|	console.log(b.isInstanceOf(C)); // false
			//	|	console.log(c.isInstanceOf(C)); // true
			//	|	console.log(d.isInstanceOf(C)); // false
			//	|
			//	|	console.log(a.isInstanceOf(D)); // false
			//	|	console.log(b.isInstanceOf(D)); // false
			//	|	console.log(c.isInstanceOf(D)); // false
			//	|	console.log(d.isInstanceOf(D)); // true
			return	{};	// Object
		},

		extend: function(source){
			// summary:
			//		Adds all properties and methods of source to constructor's
			//		prototype, making them available to all instances created with
			//		constructor. This method is specific to constructors created with
			//		declare().
			// source: Object
			//		Source object which properties are going to be copied to the
			//		constructor's prototype.
			// description:
			//		Adds source properties to the constructor's prototype. It can
			//		override existing properties.
			//
			//		This method is similar to dojo.extend function, but it is specific
			//		to constructors produced by declare(). It is implemented
			//		using dojo.safeMixin, and it skips a constructor property,
			//		and properly decorates copied functions.
			//
			// example:
			//	|	var A = declare(null, {
			//	|		m1: function(){},
			//	|		s1: "Popokatepetl"
			//	|	});
			//	|	A.extend({
			//	|		m1: function(){},
			//	|		m2: function(){},
			//	|		f1: true,
			//	|		d1: 42
			//	|	});
		},

		createSubclass: function(mixins, props){
			// summary:
			//		Create a subclass of the declared class from a list of base classes.
			// mixins: Function[]
			//		Specifies a list of bases (the left-most one is the most deepest
			//		base).
			// props: Object?
			//		An optional object whose properties are copied to the created prototype.
			// returns: dojo/_base/declare.__DeclareCreatedObject
			//		New constructor function.
			// description:
			//		Create a constructor using a compact notation for inheritance and
			//		prototype extension.
			//
			//		Mixin ancestors provide a type of multiple inheritance.
			//		Prototypes of mixin ancestors are copied to the new class:
			//		changes to mixin prototypes will not affect classes to which
			//		they have been mixed in.
			//
			// example:
			//	|	var A = declare(null, {
			//	|		m1: function(){},
			//	|		s1: "bar"
			//	|	});
			//	|	var B = declare(null, {
			//	|		m2: function(){},
			//	|		s2: "foo"
			//	|	});
			//	|	var C = declare(null, {
			//	|	});
			//	|	var D1 = A.createSubclass([B, C], {
			//	|		m1: function(){},
			//	|		d1: 42
			//	|	});
			//	|	var d1 = new D1();
			//	|
			//	|	// this is equivalent to:
			//	|	var D2 = declare([A, B, C], {
			//	|		m1: function(){},
			//	|		d1: 42
			//	|	});
			//	|	var d2 = new D2();
		}
	};
	=====*/

	// For back-compat, remove for 2.0
	dojo.safeMixin = declare.safeMixin = safeMixin;
	dojo.declare = declare;

	return declare;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 336:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * This library interprets options passed in via dot-notation instead of JSON in the Query URL.
 * The implementation is both for readability and security in some systems, esp. tomcat where
 * passing JSON in the Query URL is both bad-form and potentially insecure.
 *
 * This is the dot-object library: https://www.npmjs.com/package/dot-object
 *
 * Usage is depicted here:
 * http://gmod.org/wiki/JBrowse_Configuration_Guide#addFeatures
 *
 */
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(332), __webpack_require__(92), __webpack_require__(439)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (declare, array, dotObject) {
    return declare(null, {

        constructor: function constructor() {},

        generateUrl: function generateUrl(input) {
            var returnObject = dotObject.dot(input);
            var returnString;
            Object.keys(returnObject).forEach(function (key) {
                var stringEntry = key + '=' + returnObject[key];
                if (!returnString) {
                    returnString = stringEntry;
                } else {
                    returnString += '&' + stringEntry;
                }
            });

            return returnString;
        },

        generateJsonFromKeyArray: function generateJsonFromKeyArray(inputJson, keyArray, keyDepth, value) {
            if (!keyArray || keyArray.length == keyDepth) return;

            var firstKey = keyArray[keyDepth - 1];
            // set value if the last one
            if (keyArray.length == keyDepth - 1) {
                inputJson[firstKey] = value;
                return;
            }

            // more keys available, so if nothing is set, just set to null
            if (!inputJson.hasOwnProperty(firstKey)) {
                inputJson[firstKey] = {};
            }
            this.generateJsonFromKeyArray(inputJson[firstKey], keyArray, ++keyDepth, value);
        },

        mapParam: function mapParam(inputJson, queryParam) {
            var inputQA = queryParam.split("=");
            var query = inputQA[0];
            var value = inputQA[1];
            dotObject.str(query, value, inputJson);
        },

        generateJsonFromKey: function generateJsonFromKey(inputJson, keyString) {
            var allParams = keyString.split("\&");
            var mapParamB = this.mapParam;
            allParams.forEach(function (queryParam) {
                mapParamB(inputJson, queryParam);
            });
        },

        handleQueryParams: function handleQueryParams(config, queryParams) {
            var queryNameArray, storeName, propertyName, internalStore;
            var storeTracks = {};
            var storeBookmarks = {};

            var featuresArray = [];
            var featureIndex;

            Object.keys(queryParams).forEach(function (queryParam) {
                if (queryParam.indexOf('addStores\.') == 0) {
                    queryNameArray = queryParam.split("\.");
                    propertyName = queryNameArray.slice(1).join('.');
                    dotObject.str('stores.' + propertyName, queryParams[queryParam], config);
                } else if (queryParam.indexOf('addTracks\.') == 0) {
                    queryNameArray = queryParam.split("\.");
                    storeName = queryNameArray[1];
                    internalStore = storeTracks[storeName] ? storeTracks[storeName] : {};
                    propertyName = queryNameArray.slice(2).join('.');
                    if (storeName !== 'none') {
                        dotObject.str('store', storeName, internalStore);
                    }
                    dotObject.str(propertyName, queryParams[queryParam], internalStore);
                    dotObject.str(storeName, internalStore, storeTracks);
                } else if (queryParam.indexOf('addBookmarks\.') == 0) {
                    queryNameArray = queryParam.split("\.");
                    storeName = queryNameArray[1];
                    internalStore = storeBookmarks[storeName] ? storeBookmarks[storeName] : {};
                    propertyName = queryNameArray.slice(2).join('.');
                    dotObject.str(propertyName, queryParams[queryParam], internalStore);
                    dotObject.str(storeName, internalStore, storeBookmarks);
                } else if (queryParam.indexOf('addFeatures\.') == 0) {
                    queryNameArray = queryParam.split("\.");
                    featureIndex = queryNameArray[1];
                    propertyName = queryNameArray.slice(2).join('.');
                    var feature = featuresArray[featureIndex];
                    feature = feature ? feature : {};
                    dotObject.str(propertyName, queryParams[queryParam], feature);
                    featuresArray[featureIndex] = feature;
                }
            });

            // convert to an array
            if (storeTracks) {
                // add one for each
                for (var track in storeTracks) {
                    if (!config.tracks) {
                        config.tracks = [];
                    }
                    var storeTrack = storeTracks[track];
                    config.tracks.push(storeTrack);
                }
            }

            if (storeBookmarks) {
                // add one for each
                for (var bookmark in storeBookmarks) {
                    if (!config.bookmarks) {
                        config.bookmarks = {};
                    }
                    if (!config.bookmarks.features) {
                        config.bookmarks.features = [];
                    }
                    var storeBookmark = storeBookmarks[bookmark];
                    // explicitly try to handle loc strings?
                    config.bookmarks.features.push(storeBookmark);
                }
            }

            if (featuresArray.length > 0) {
                config.stores = config.stores ? config.stores : {};
                config.stores.url = config.stores.url ? config.stores.url : {};
                config.stores.url.features = array.filter(featuresArray, function (el) {
                    return el != null;
                });
            }
        }
    });
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 339:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(331)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(lang){

	// module:
	//		dojo/io-query

	var backstop = {};

	return {
		// summary:
		//		This module defines query string processing functions.

		objectToQuery: function objectToQuery(/*Object*/ map){
			// summary:
			//		takes a name/value mapping object and returns a string representing
			//		a URL-encoded version of that object.
			// example:
			//		this object:
			//
			//	|	{
			//	|		blah: "blah",
			//	|		multi: [
			//	|			"thud",
			//	|			"thonk"
			//	|		]
			//	|	};
			//
			//		yields the following query string:
			//
			//	|	"blah=blah&multi=thud&multi=thonk"

			// FIXME: need to implement encodeAscii!!
			var enc = encodeURIComponent, pairs = [];
			for(var name in map){
				var value = map[name];
				if(value != backstop[name]){
					var assign = enc(name) + "=";
					if(lang.isArray(value)){
						for(var i = 0, l = value.length; i < l; ++i){
							pairs.push(assign + enc(value[i]));
						}
					}else{
						pairs.push(assign + enc(value));
					}
				}
			}
			return pairs.join("&"); // String
		},

		queryToObject: function queryToObject(/*String*/ str){
			// summary:
			//		Create an object representing a de-serialized query section of a
			//		URL. Query keys with multiple values are returned in an array.
			//
			// example:
			//		This string:
			//
			//	|		"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
			//
			//		results in this object structure:
			//
			//	|		{
			//	|			foo: [ "bar", "baz" ],
			//	|			thinger: " spaces =blah",
			//	|			zonk: "blarg"
			//	|		}
			//
			//		Note that spaces and other urlencoded entities are correctly
			//		handled.

        	var dec = decodeURIComponent, qp = str.split("&"), ret = {}, name, val;
			for(var i = 0, l = qp.length, item; i < l; ++i){
				item = qp[i];
				if(item.length){
					var s = item.indexOf("=");
					if(s < 0){
						name = dec(item);
						val = "";
					}else{
						name = dec(item.slice(0, s));
						val = dec(item.slice(s + 1));
					}
					if(typeof ret[name] == "string"){ // inline'd type check
						ret[name] = [ret[name]];
					}

					if(lang.isArray(ret[name])){
						ret[name].push(val);
					}else{
						ret[name] = val;
					}
				}
			}
			return ret; // Object
		}
	};
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 344:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Rectangle-layout manager that lays out rectangles using bitmaps at
* resolution that, for efficiency, may be somewhat lower than that of
* the coordinate system for the rectangles being laid out.  `pitchX`
* and `pitchY` are the ratios of input scale resolution to internal
* bitmap resolution.
*/

// minimum excess size of the array at which we garbage collect
var minSizeToBotherWith = 10000;
var maxFeaturePitchWidth = 5000;

// a single row in the layout

var LayoutRow = function () {
    function LayoutRow(rowNumber) {
        _classCallCheck(this, LayoutRow);

        this.rowNumber = rowNumber;
        this.padding = 1;
        this.sizeLimit = 1000000;

        // this.offset is the offset of the bits array relative to the genomic coordinates
        //      (modified by pitchX, but we don't know that in this class)
        // this.bits is the array of items in the layout row, indexed by (x - this.offset)
        // this.min is the leftmost edge of all the rectangles we have in the layout
        // this.max is the rightmost edge of all the rectangles we have in the layout
    }

    _createClass(LayoutRow, [{
        key: 'log',
        value: function log(msg) {
            //if (this.rowNumber === 0)
            console.log('r' + this.rowNumber + ': ' + msg);
        }
    }, {
        key: 'setAllFilled',
        value: function setAllFilled(data) {
            this.allFilled = data;
        }
    }, {
        key: 'getItemAt',
        value: function getItemAt(x) {
            if (this.allFilled) return this.allFilled;
            // return (
            //     this.min !== undefined &&
            //     x >= this.min &&
            //     x <= this.max &&
            //     this.bits[x - this.min]
            // )

            if (this.min === undefined) return undefined;
            if (x < this.min) return undefined;
            if (x >= this.max) return undefined;
            var offset = x - this.offset;
            // if (offset < 0)
            //     debugger
            // if (offset >= this.bits.length)
            //     debugger
            return this.bits[offset];
        }
    }, {
        key: 'isRangeClear',
        value: function isRangeClear(left, right) {
            if (this.allFilled) return false;

            if (this.min === undefined) return true;

            if (right <= this.min || left >= this.max) return true;

            // TODO: check right and middle before looping
            var maxX = Math.min(this.max, right);
            var x = Math.max(this.min, left);
            for (; x < right && x < maxX; x += 1) {
                if (this.getItemAt(x)) return false;
            }return true;
        }
    }, {
        key: 'initialize',
        value: function initialize(left, right) {
            // NOTE: this.min, this.max, and this.offset are interbase coordinates
            var rectWidth = right - left;
            this.offset = left - rectWidth;
            this.min = left;
            this.max = right;
            this.bits = new Array(right - left + 2 * rectWidth);
            // this.log(`initialize ${this.min} - ${this.max} (${this.bits.length})`)
        }
    }, {
        key: 'addRect',
        value: function addRect(rect, data) {
            var left = rect.l;
            var right = rect.r + this.padding; // only padding on the right

            // initialize if necessary
            if (this.min === undefined) {
                this.initialize(left, right);
            } else {
                // or check if we need to expand to the left and/or to the right

                // expand rightward by the feature length + whole current length if necessary
                var currLength = this.bits.length;

                if (right - this.offset >= this.bits.length) {
                    var additionalLength = right - this.offset - this.bits.length + 1 + this.bits.length;
                    if (this.bits.length + additionalLength > this.sizeLimit) {
                        console.warn('Layout width limit exceeded, discarding old layout. Please be more careful about discarding unused blocks.');
                        this.initialize(left, right);
                    } else if (additionalLength > 0) {
                        this.bits = this.bits.concat(new Array(additionalLength));
                        // this.log(`expand right (${additionalLength}): ${this.offset} | ${this.min} - ${this.max}`)
                    }
                }

                // expand by 2x leftward if necessary
                if (left < this.offset) {
                    var _additionalLength = this.offset - left + currLength;
                    if (this.bits.length + _additionalLength > this.sizeLimit) {
                        console.warn('Layout width limit exceeded, discarding old layout. Please be more careful about discarding unused blocks.');
                        this.initialize(left, right);
                    } else {
                        this.bits = new Array(_additionalLength).concat(this.bits);
                        this.offset -= _additionalLength;
                        // this.log(`expand left (${additionalLength}): ${this.offset} | ${this.min} - ${this.max}`)
                    }
                }
            }

            // set the bits in the bitmask
            var oLeft = left - this.offset;
            var oRight = right - this.offset;
            // if (oLeft < 0) debugger
            // if (oRight < 0) debugger
            // if (oRight <= oLeft) debugger
            // if (oRight > this.bits.length) debugger
            if (oRight - oLeft > maxFeaturePitchWidth) {
                console.warn('Layout X pitch set too low, feature spans ' + (oRight - oLeft) + ' bits in a single row.', rect, data);
            }

            for (var x = oLeft; x < oRight; x += 1) {
                //if (this.bits[x] && this.bits[x].get('name') !== data.get('name')) debugger
                this.bits[x] = data;
            }

            if (left < this.min) this.min = left;
            if (right > this.max) this.max = right;
            //// this.log(`added ${leftX} - ${rightX}`)
        }

        /**
        *  Given a range of interbase coordinates, deletes all data dealing with that range
        */

    }, {
        key: 'discardRange',
        value: function discardRange(left, right) {
            if (this.allFilled) return; // allFilled is irrevocable currently

            // if we have no data, do nothing
            if (!this.bits) return;

            // if doesn't overlap at all, do nothing
            if (right <= this.min || left >= this.max) return;

            // if completely encloses range, discard everything
            if (left <= this.min && right >= this.max) {
                this.min = undefined;
                this.max = undefined;
                this.bits = undefined;
                this.offset = undefined;
                return;
            }

            // if overlaps left edge, adjust the min
            if (right > this.min && left <= this.min) {
                this.min = right;
            }

            // if overlaps right edge, adjust the max
            if (left < this.max && right >= this.max) {
                this.max = left;
            }

            // now trim the left, right, or both sides of the array
            if (this.offset < this.min - minSizeToBotherWith && this.bits.length > this.max + minSizeToBotherWith - this.offset) {
                // trim both sides
                var leftTrimAmount = this.min - this.offset;
                var rightTrimAmount = this.bits.length - 1 - (this.max - this.offset);
                // if (rightTrimAmount <= 0) debugger
                // if (leftTrimAmount <= 0) debugger
                // this.log(`trim both sides, ${leftTrimAmount} from left, ${rightTrimAmount} from right`)
                this.bits = this.bits.slice(leftTrimAmount, this.bits.length - rightTrimAmount);
                this.offset += leftTrimAmount;
                // if (this.offset > this.min) debugger
                // if (this.bits.length <= this.max - this.offset) debugger
            } else if (this.offset < this.min - minSizeToBotherWith) {
                // trim left side
                var desiredOffset = this.min - Math.floor(minSizeToBotherWith / 2);
                var trimAmount = desiredOffset - this.offset;
                // this.log(`trim left side by ${trimAmount}`)
                this.bits.splice(0, trimAmount);
                this.offset += trimAmount;
                // if (this.offset > this.min) debugger
                // if (this.bits.length <= this.max - this.offset) debugger
            } else if (this.bits.length > this.max - this.offset + minSizeToBotherWith) {
                // trim right side
                var desiredLength = this.max - this.offset + 1 + Math.floor(minSizeToBotherWith / 2);
                // this.log(`trim right side by ${this.bits.length-desiredLength}`)
                // if (desiredLength > this.bits.length) debugger
                this.bits.length = desiredLength;
                // if (this.offset > this.min) debugger
                // if (this.bits.length <= this.max - this.offset) debugger
            }

            // if (this.offset > this.min) debugger
            // if (this.bits.length <= this.max - this.offset) debugger

            // if range now enclosed in the new bounds, loop through and clear the bits
            var oLeft = Math.max(this.min, left) - this.offset;
            // if (oLeft < 0) debugger
            // if (oLeft >= this.bits.length) debugger
            // if (oRight < 0) debugger
            // if (oRight >= this.bits.length) debugger

            var oRight = Math.min(right, this.max) - this.offset;
            for (var x = oLeft; x >= 0 && x < oRight; x += 1) {
                this.bits[x] = undefined;
            }
        }
    }]);

    return LayoutRow;
}();

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(332)], __WEBPACK_AMD_DEFINE_RESULT__ = (function (declare) {
    return declare(null, {
        /**
        * @param args.pitchX  layout grid pitch in the X direction
        * @param args.pitchY  layout grid pitch in the Y direction
        * @param args.maxHeight  maximum layout height, default Infinity (no max)
        */
        constructor: function constructor(args) {
            this.pitchX = args.pitchX || 10;
            this.pitchY = args.pitchY || 10;

            this.displayMode = args.displayMode;

            // reduce the pitchY to try and pack the features tighter
            if (this.displayMode === 'compact') {
                this.pitchY = Math.round(this.pitchY / 4) || 1;
                this.pitchX = Math.round(this.pitchX / 4) || 1;
            }

            // console.log(`pitch: ${this.pitchX} / ${this.pitchY}`)

            this.bitmap = [];
            this.rectangles = {};
            this.maxHeight = Math.ceil((args.maxHeight || Infinity) / this.pitchY);
            this.pTotalHeight = 0; // total height, in units of bitmap squares (px/pitchY)
        },


        /**
        * @returns {Number} top position for the rect, or Null if laying out the rect would exceed maxHeight
        */
        addRect: function addRect(id, left, right, height, data) {
            // if we have already laid it out, return its layout
            if (id in this.rectangles) {
                var storedRec = this.rectangles[id];
                if (storedRec.top === null) return null;

                // add it to the bitmap again, since that bitmap range may have been discarded
                this._addRectToBitmap(storedRec, data);
                return storedRec.top * this.pitchY;
            }

            var pLeft = Math.floor(left / this.pitchX);
            var pRight = Math.floor(right / this.pitchX);
            var pHeight = Math.ceil(height / this.pitchY);

            var midX = Math.floor((pLeft + pRight) / 2);
            var rectangle = { id: id, l: pLeft, r: pRight, mX: midX, h: pHeight };
            if (data) rectangle.data = data;

            var maxTop = this.maxHeight - pHeight;
            var top = 0;
            for (; top <= maxTop; top += 1) {
                if (!this._collides(rectangle, top)) break;
            }

            if (top > maxTop) {
                rectangle.top = top = null;
                this.rectangles[id] = rectangle;
                this.pTotalHeight = Math.max(this.pTotalHeight || 0, top + pHeight);
                return null;
            }
            rectangle.top = top;
            this._addRectToBitmap(rectangle, data);
            this.rectangles[id] = rectangle;
            this.pTotalHeight = Math.max(this.pTotalHeight || 0, top + pHeight);
            // console.log(`G2 ${data.get('name')} ${top}`)
            return top * this.pitchY;
        },
        _collides: function _collides(rect, top) {
            if (this.displayMode === 'collapsed') return false;

            var bitmap = this.bitmap;
            // var mY = top + rect.h/2; // Y midpoint: ( top+height  + top ) / 2

            // test exhaustively
            var maxY = top + rect.h;
            for (var y = top; y < maxY; y += 1) {
                var row = bitmap[y];
                if (row && !row.isRangeClear(rect.l, rect.r)) {
                    return true;
                }
            }

            return false;
        },


        /**
        * make a subarray if it does not exist
        * @private
        */
        _autovivifyRow: function _autovivifyRow(bitmap, y) {
            var row = bitmap[y];
            if (!row) {
                row = new LayoutRow(y);
                bitmap[y] = row;
            }
            return row;
        },
        _addRectToBitmap: function _addRectToBitmap(rect, data) {
            if (rect.top === null) return;

            data = data || true;
            var bitmap = this.bitmap;
            var av = this._autovivifyRow;
            var yEnd = rect.top + rect.h;
            if (rect.r - rect.l > maxFeaturePitchWidth) {
                // the rect is very big in relation to the view size, just
                // pretend, for the purposes of layout, that it extends
                // infinitely.  this will cause weird layout if a user
                // scrolls manually for a very, very long time along the
                // genome at the same zoom level.  but most users will not
                // do that.  hopefully.
                for (var y = rect.top; y < yEnd; y += 1) {
                    av(bitmap, y).setAllFilled(data);
                }
            } else {
                for (var _y = rect.top; _y < yEnd; _y += 1) {
                    av(bitmap, _y).addRect(rect, data);
                }
            }
        },


        /**
        *  Given a range of X coordinates, deletes all data dealing with
        *  the features.
        */
        discardRange: function discardRange(left, right) {
            // console.log( 'discard', left, right );
            var pLeft = Math.floor(left / this.pitchX);
            var pRight = Math.floor(right / this.pitchX);
            var bitmap = this.bitmap;
            for (var y = 0; y < bitmap.length; y += 1) {
                var row = bitmap[y];
                if (row) row.discardRange(pLeft, pRight);
            }
        },
        hasSeen: function hasSeen(id) {
            return !!this.rectangles[id];
        },
        getByCoord: function getByCoord(x, y) {
            var pY = Math.floor(y / this.pitchY);
            var row = this.bitmap[pY];
            if (!row) return undefined;
            var pX = Math.floor(x / this.pitchX);
            return row.getItemAt(pX);
        },
        getByID: function getByID(id) {
            var r = this.rectangles[id];
            if (r) {
                return r.data || true;
            }
            return undefined;
        },
        cleanup: function cleanup() {},
        getTotalHeight: function getTotalHeight() {
            return this.pTotalHeight * this.pitchY;
        }
    });
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),

/***/ 439:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// from: https://unpkg.com/dot-object@1.7.0/dist/dot-object.js
(function (global, exportName) {
    'use strict';

    function _process(v, mod) {
        var i;
        var r;

        if (typeof mod === 'function') {
            r = mod(v);
            if (r !== undefined) {
                v = r;
            }
        } else if (Array.isArray(mod)) {
            for (i = 0; i < mod.length; i++) {
                r = mod[i](v);
                if (r !== undefined) {
                    v = r;
                }
            }
        }

        return v;
    }

    function parseKey(key, val) {
        // detect negative index notation
        if (key[0] === '-' && Array.isArray(val) && /^-\d+$/.test(key)) {
            return val.length + parseInt(key, 10);
        }
        return key;
    }

    function isIndex(k) {
        return (/^\d+/.test(k)
        );
    }

    function isObject(val) {
        return Object.prototype.toString.call(val) === '[object Object]';
    }

    function isArrayOrObject(val) {
        return Object(val) === val;
    }

    function isEmptyObject(val) {
        return Object.keys(val).length === 0;
    }

    function parsePath(path, sep) {
        if (path.indexOf('[') >= 0) {
            path = path.replace(/\[/g, '.').replace(/]/g, '');
        }
        return path.split(sep);
    }

    function DotObject(seperator, override, useArray) {
        if (!(this instanceof DotObject)) {
            return new DotObject(seperator, override, useArray);
        }

        if (typeof override === 'undefined') override = false;
        if (typeof useArray === 'undefined') useArray = true;
        this.seperator = seperator || '.';
        this.override = override;
        this.useArray = useArray;
        this.keepArray = false;

        // contains touched arrays
        this.cleanup = [];
    }

    var dotDefault = new DotObject('.', false, true);

    function wrap(method) {
        return function () {
            return dotDefault[method].apply(dotDefault, arguments);
        };
    }

    DotObject.prototype._fill = function (a, obj, v, mod) {
        var k = a.shift();

        if (a.length > 0) {
            obj[k] = obj[k] || (this.useArray && isIndex(a[0]) ? [] : {});

            if (!isArrayOrObject(obj[k])) {
                if (this.override) {
                    obj[k] = {};
                } else {
                    if (!(isArrayOrObject(v) && isEmptyObject(v))) {
                        throw new Error('Trying to redefine `' + k + '` which is a ' + _typeof(obj[k]));
                    }

                    return;
                }
            }

            this._fill(a, obj[k], v, mod);
        } else {
            if (!this.override && isArrayOrObject(obj[k]) && !isEmptyObject(obj[k])) {
                if (!(isArrayOrObject(v) && isEmptyObject(v))) {
                    throw new Error("Trying to redefine non-empty obj['" + k + "']");
                }

                return;
            }

            obj[k] = _process(v, mod);
        }
    };

    /**
     *
     * Converts an object with dotted-key/value pairs to it's expanded version
     *
     * Optionally transformed by a set of modifiers.
     *
     * Usage:
     *
     *   var row = {
     *     'nr': 200,
     *     'doc.name': '  My Document  '
     *   }
     *
     *   var mods = {
     *     'doc.name': [_s.trim, _s.underscored]
     *   }
     *
     *   dot.object(row, mods)
     *
     * @param {Object} obj
     * @param {Object} mods
     */
    DotObject.prototype.object = function (obj, mods) {
        var self = this;

        Object.keys(obj).forEach(function (k) {
            var mod = mods === undefined ? null : mods[k];
            // normalize array notation.
            var ok = parsePath(k, self.seperator).join(self.seperator);

            if (ok.indexOf(self.seperator) !== -1) {
                self._fill(ok.split(self.seperator), obj, obj[k], mod);
                delete obj[k];
            } else if (self.override) {
                obj[k] = _process(obj[k], mod);
            }
        });

        return obj;
    };

    /**
     * @param {String} path dotted path
     * @param {String} v value to be set
     * @param {Object} obj object to be modified
     * @param {Function|Array} mod optional modifier
     */
    DotObject.prototype.str = function (path, v, obj, mod) {
        if (path.indexOf(this.seperator) !== -1) {
            this._fill(path.split(this.seperator), obj, v, mod);
        } else if (!obj.hasOwnProperty(path) || this.override) {
            obj[path] = _process(v, mod);
        }

        return obj;
    };

    /**
     *
     * Pick a value from an object using dot notation.
     *
     * Optionally remove the value
     *
     * @param {String} path
     * @param {Object} obj
     * @param {Boolean} remove
     */
    DotObject.prototype.pick = function (path, obj, remove) {
        var i;
        var keys;
        var val;
        var key;
        var cp;

        keys = parsePath(path, this.seperator);
        for (i = 0; i < keys.length; i++) {
            key = parseKey(keys[i], obj);
            if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && key in obj) {
                if (i === keys.length - 1) {
                    if (remove) {
                        val = obj[key];
                        delete obj[key];
                        if (Array.isArray(obj)) {
                            cp = keys.slice(0, -1).join('.');
                            if (this.cleanup.indexOf(cp) === -1) {
                                this.cleanup.push(cp);
                            }
                        }
                        return val;
                    } else {
                        return obj[key];
                    }
                } else {
                    obj = obj[key];
                }
            } else {
                return undefined;
            }
        }
        if (remove && Array.isArray(obj)) {
            obj = obj.filter(function (n) {
                return n !== undefined;
            });
        }
        return obj;
    };

    /**
     *
     * Remove value from an object using dot notation.
     *
     * @param {String} path
     * @param {Object} obj
     * @return {Mixed} The removed value
     */
    DotObject.prototype.remove = function (path, obj) {
        var i;

        this.cleanup = [];
        if (Array.isArray(path)) {
            for (i = 0; i < path.length; i++) {
                this.pick(path[i], obj, true);
            }
            this._cleanup(obj);
            return obj;
        } else {
            return this.pick(path, obj, true);
        }
    };

    DotObject.prototype._cleanup = function (obj) {
        var ret;
        var i;
        var keys;
        var root;
        if (this.cleanup.length) {
            for (i = 0; i < this.cleanup.length; i++) {
                keys = this.cleanup[i].split('.');
                root = keys.splice(0, -1).join('.');
                ret = root ? this.pick(root, obj) : obj;
                ret = ret[keys[0]].filter(function (v) {
                    return v !== undefined;
                });
                this.set(this.cleanup[i], ret, obj);
            }
            this.cleanup = [];
        }
    };

    // alias method
    DotObject.prototype.del = DotObject.prototype.remove;

    /**
     *
     * Move a property from one place to the other.
     *
     * If the source path does not exist (undefined)
     * the target property will not be set.
     *
     * @param {String} source
     * @param {String} target
     * @param {Object} obj
     * @param {Function|Array} mods
     * @param {Boolean} merge
     */
    DotObject.prototype.move = function (source, target, obj, mods, merge) {
        if (typeof mods === 'function' || Array.isArray(mods)) {
            this.set(target, _process(this.pick(source, obj, true), mods), obj, merge);
        } else {
            merge = mods;
            this.set(target, this.pick(source, obj, true), obj, merge);
        }

        return obj;
    };

    /**
     *
     * Transfer a property from one object to another object.
     *
     * If the source path does not exist (undefined)
     * the property on the other object will not be set.
     *
     * @param {String} source
     * @param {String} target
     * @param {Object} obj1
     * @param {Object} obj2
     * @param {Function|Array} mods
     * @param {Boolean} merge
     */
    DotObject.prototype.transfer = function (source, target, obj1, obj2, mods, merge) {
        if (typeof mods === 'function' || Array.isArray(mods)) {
            this.set(target, _process(this.pick(source, obj1, true), mods), obj2, merge);
        } else {
            merge = mods;
            this.set(target, this.pick(source, obj1, true), obj2, merge);
        }

        return obj2;
    };

    /**
     *
     * Copy a property from one object to another object.
     *
     * If the source path does not exist (undefined)
     * the property on the other object will not be set.
     *
     * @param {String} source
     * @param {String} target
     * @param {Object} obj1
     * @param {Object} obj2
     * @param {Function|Array} mods
     * @param {Boolean} merge
     */
    DotObject.prototype.copy = function (source, target, obj1, obj2, mods, merge) {
        if (typeof mods === 'function' || Array.isArray(mods)) {
            this.set(target, _process(
            // clone what is picked
            JSON.parse(JSON.stringify(this.pick(source, obj1, false))), mods), obj2, merge);
        } else {
            merge = mods;
            this.set(target, this.pick(source, obj1, false), obj2, merge);
        }

        return obj2;
    };

    /**
     *
     * Set a property on an object using dot notation.
     *
     * @param {String} path
     * @param {Mixed} val
     * @param {Object} obj
     * @param {Boolean} merge
     */
    DotObject.prototype.set = function (path, val, obj, merge) {
        var i;
        var k;
        var keys;
        var key;

        // Do not operate if the value is undefined.
        if (typeof val === 'undefined') {
            return obj;
        }
        keys = parsePath(path, this.seperator);

        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            if (i === keys.length - 1) {
                if (merge && isObject(val) && isObject(obj[key])) {
                    for (k in val) {
                        if (val.hasOwnProperty(k)) {
                            obj[key][k] = val[k];
                        }
                    }
                } else if (merge && Array.isArray(obj[key]) && Array.isArray(val)) {
                    for (var j = 0; j < val.length; j++) {
                        obj[keys[i]].push(val[j]);
                    }
                } else {
                    obj[key] = val;
                }
            } else if (
            // force the value to be an object
            !obj.hasOwnProperty(key) || !isObject(obj[key]) && !Array.isArray(obj[key])) {
                // initialize as array if next key is numeric
                if (/^\d+$/.test(keys[i + 1])) {
                    obj[key] = [];
                } else {
                    obj[key] = {};
                }
            }
            obj = obj[key];
        }
        return obj;
    };

    /**
     *
     * Transform an object
     *
     * Usage:
     *
     *   var obj = {
     *     "id": 1,
     *    "some": {
     *      "thing": "else"
     *    }
     *   }
     *
     *   var transform = {
     *     "id": "nr",
     *    "some.thing": "name"
     *   }
     *
     *   var tgt = dot.transform(transform, obj)
     *
     * @param {Object} recipe Transform recipe
     * @param {Object} obj Object to be transformed
     * @param {Array} mods modifiers for the target
     */
    DotObject.prototype.transform = function (recipe, obj, tgt) {
        obj = obj || {};
        tgt = tgt || {};
        Object.keys(recipe).forEach(function (key) {
            this.set(recipe[key], this.pick(key, obj), tgt);
        }.bind(this));
        return tgt;
    };

    /**
     *
     * Convert object to dotted-key/value pair
     *
     * Usage:
     *
     *   var tgt = dot.dot(obj)
     *
     *   or
     *
     *   var tgt = {}
     *   dot.dot(obj, tgt)
     *
     * @param {Object} obj source object
     * @param {Object} tgt target object
     * @param {Array} path path array (internal)
     */
    DotObject.prototype.dot = function (obj, tgt, path) {
        tgt = tgt || {};
        path = path || [];
        Object.keys(obj).forEach(function (key) {
            if (isArrayOrObject(obj[key]) && (isObject(obj[key]) && !isEmptyObject(obj[key]) || Array.isArray(obj[key]) && !this.keepArray && obj[key].length !== 0)) {
                return this.dot(obj[key], tgt, path.concat(key));
            } else {
                tgt[path.concat(key).join(this.seperator)] = obj[key];
            }
        }.bind(this));
        return tgt;
    };

    DotObject.pick = wrap('pick');
    DotObject.move = wrap('move');
    DotObject.transfer = wrap('transfer');
    DotObject.transform = wrap('transform');
    DotObject.copy = wrap('copy');
    DotObject.object = wrap('object');
    DotObject.str = wrap('str');
    DotObject.set = wrap('set');
    DotObject.del = DotObject.remove = wrap('remove');
    DotObject.dot = wrap('dot');
    ['override', 'overwrite'].forEach(function (prop) {
        Object.defineProperty(DotObject, prop, {
            get: function get() {
                return dotDefault.override;
            },
            set: function set(val) {
                dotDefault.override = !!val;
            }
        });
    });
    ['useArray', 'keepArray'].forEach(function (prop) {
        Object.defineProperty(DotObject, prop, {
            get: function get() {
                return dotDefault[prop];
            },
            set: function set(val) {
                dotDefault[prop] = val;
            }
        });
    });

    DotObject._process = _process;

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return DotObject;
        }).call(null, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {
        global[exportName] = DotObject;
    }
})(undefined, 'DotObject');

/***/ }),

/***/ 584:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(621), __webpack_require__(585), __webpack_require__(610), __webpack_require__.dj.c(module.i), __webpack_require__.dj.m(module)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(global, has, config, require, module){
	// module:
	//		dojo/_base/kernel

	// This module is the foundational module of the dojo boot sequence; it defines the dojo object.

	var
		// loop variables for this module
		i, p,

		// create dojo, dijit, and dojox
		// FIXME: in 2.0 remove dijit, dojox being created by dojo
		dijit = {},
		dojox = {},
		dojo = {
			// summary:
			//		This module is the foundational module of the dojo boot sequence; it defines the dojo object.

			// notice dojo takes ownership of the value of the config module
			config:config,
			global:global,
			dijit:dijit,
			dojox:dojox
		};


	// Configure the scope map. For a 100% AMD application, the scope map is not needed other than to provide
	// a _scopeName property for the dojo, dijit, and dojox root object so those packages can create
	// unique names in the global space.
	//
	// Built, legacy modules use the scope map to allow those modules to be expressed as if dojo, dijit, and dojox,
	// where global when in fact they are either global under different names or not global at all. In v1.6-, the
	// config variable "scopeMap" was used to map names as used within a module to global names. This has been
	// subsumed by the AMD map configuration variable which can relocate packages to different names. For backcompat,
	// only the "*" mapping is supported. See http://livedocs.dojotoolkit.org/developer/design/loader#legacy-cross-domain-mode for details.
	//
	// The following computations contort the packageMap for this dojo instance into a scopeMap.
	var scopeMap =
			// a map from a name used in a legacy module to the (global variable name, object addressed by that name)
			// always map dojo, dijit, and dojox
			{
				dojo:["dojo", dojo],
				dijit:["dijit", dijit],
				dojox:["dojox", dojox]
			},

		packageMap =
			// the package map for this dojo instance; note, a foreign loader or no pacakgeMap results in the above default config
			(require.map && require.map[module.i.match(/[^\/]+/)[0]]),

		item;


	// process all mapped top-level names for this instance of dojo
	for(p in packageMap){
		if(scopeMap[p]){
			// mapped dojo, dijit, or dojox
			scopeMap[p][0] = packageMap[p];
		}else{
			// some other top-level name
			scopeMap[p] = [packageMap[p], {}];
		}
	}

	// publish those names to _scopeName and, optionally, the global namespace
	for(p in scopeMap){
		item = scopeMap[p];
		item[1]._scopeName = item[0];
		if(!config.noGlobals){
			global[item[0]] = item[1];
		}
	}
	dojo.scopeMap = scopeMap;

	/*===== dojo.__docParserConfigureScopeMap(scopeMap); =====*/

	// FIXME: dojo.baseUrl and dojo.config.baseUrl should be deprecated
	dojo.baseUrl = dojo.config.baseUrl = require.baseUrl;
	dojo.isAsync = !has("dojo-loader") || require.async;
	dojo.locale = config.locale;

	var rev = "$Rev: aaa6750 $".match(/[0-9a-f]{7,}/);
	dojo.version = {
		// summary:
		//		Version number of the Dojo Toolkit
		// description:
		//		Hash about the version, including
		//
		//		- major: Integer: Major version. If total version is "1.2.0beta1", will be 1
		//		- minor: Integer: Minor version. If total version is "1.2.0beta1", will be 2
		//		- patch: Integer: Patch version. If total version is "1.2.0beta1", will be 0
		//		- flag: String: Descriptor flag. If total version is "1.2.0beta1", will be "beta1"
		//		- revision: Number: The Git rev from which dojo was pulled

		major: 1, minor: 13, patch: 0, flag: "",
		revision: rev ? rev[0] : NaN,
		toString: function(){
			var v = dojo.version;
			return v.major + "." + v.minor + "." + v.patch + v.flag + " (" + v.revision + ")";	// String
		}
	};

	// If has("extend-dojo") is truthy, then as a dojo module is defined it should push it's definitions
	// into the dojo object, and conversely. In 2.0, it will likely be unusual to augment another object
	// as a result of defining a module. This has feature gives a way to force 2.0 behavior as the code
	// is migrated. Absent specific advice otherwise, set extend-dojo to truthy.
	has.add("extend-dojo", 1);

	if(!has("csp-restrictions")){
		(Function("d", "d.eval = function(){return d.global.eval ? d.global.eval(arguments[0]) : eval(arguments[0]);}"))(dojo);
	}
	/*=====
	dojo.eval = function(scriptText){
		// summary:
		//		A legacy method created for use exclusively by internal Dojo methods. Do not use this method
		//		directly unless you understand its possibly-different implications on the platforms your are targeting.
		// description:
		//		Makes an attempt to evaluate scriptText in the global scope. The function works correctly for browsers
		//		that support indirect eval.
		//
		//		As usual, IE does not. On IE, the only way to implement global eval is to
		//		use execScript. Unfortunately, execScript does not return a value and breaks some current usages of dojo.eval.
		//		This implementation uses the technique of executing eval in the scope of a function that is a single scope
		//		frame below the global scope; thereby coming close to the global scope. Note carefully that
		//
		//		dojo.eval("var pi = 3.14;");
		//
		//		will define global pi in non-IE environments, but define pi only in a temporary local scope for IE. If you want
		//		to define a global variable using dojo.eval, write something like
		//
		//		dojo.eval("window.pi = 3.14;")
		// scriptText:
		//		The text to evaluation.
		// returns:
		//		The result of the evaluation. Often `undefined`
	};
	=====*/


	if(has("host-rhino")){
		dojo.exit = function(exitcode){
			quit(exitcode);
		};
	}else{
		dojo.exit = function(){
		};
	}

	if(!has("host-webworker")){
		// console is immutable in FF30+, https://bugs.dojotoolkit.org/ticket/18100
		has.add("dojo-guarantee-console",
			// ensure that console.log, console.warn, etc. are defined
			1
		);
	}

	if(has("dojo-guarantee-console")){
		// IE 9 bug: https://bugs.dojotoolkit.org/ticket/18197
		has.add("console-as-object", function () {
			return Function.prototype.bind && console && typeof console.log === "object";
		});

		typeof console != "undefined" || (console = {});  // intentional assignment
		//	Be careful to leave 'log' always at the end
		var cn = [
			"assert", "count", "debug", "dir", "dirxml", "error", "group",
			"groupEnd", "info", "profile", "profileEnd", "time", "timeEnd",
			"trace", "warn", "log"
		];
		var tn;
		i = 0;
		while((tn = cn[i++])){
			if(!console[tn]){
				(function(){
					var tcn = tn + "";
					console[tcn] = ('log' in console) ? function(){
						var a = Array.prototype.slice.call(arguments);
						a.unshift(tcn + ":");
						console["log"](a.join(" "));
					} : function(){};
					console[tcn]._fake = true;
				})();
			}else if(has("console-as-object")){
				console[tn] = Function.prototype.bind.call(console[tn], console);
			}
		}
	}

	has.add("dojo-debug-messages",
		// include dojo.deprecated/dojo.experimental implementations
		!!config.isDebug
	);
	dojo.deprecated = dojo.experimental =  function(){};
	if(has("dojo-debug-messages")){
		dojo.deprecated = function(/*String*/ behaviour, /*String?*/ extra, /*String?*/ removal){
			// summary:
			//		Log a debug message to indicate that a behavior has been
			//		deprecated.
			// behaviour: String
			//		The API or behavior being deprecated. Usually in the form
			//		of "myApp.someFunction()".
			// extra: String?
			//		Text to append to the message. Often provides advice on a
			//		new function or facility to achieve the same goal during
			//		the deprecation period.
			// removal: String?
			//		Text to indicate when in the future the behavior will be
			//		removed. Usually a version number.
			// example:
			//	| dojo.deprecated("myApp.getTemp()", "use myApp.getLocaleTemp() instead", "1.0");

			var message = "DEPRECATED: " + behaviour;
			if(extra){ message += " " + extra; }
			if(removal){ message += " -- will be removed in version: " + removal; }
			console.warn(message);
		};

		dojo.experimental = function(/* String */ moduleName, /* String? */ extra){
			// summary:
			//		Marks code as experimental.
			// description:
			//		This can be used to mark a function, file, or module as
			//		experimental.	 Experimental code is not ready to be used, and the
			//		APIs are subject to change without notice.	Experimental code may be
			//		completed deleted without going through the normal deprecation
			//		process.
			// moduleName: String
			//		The name of a module, or the name of a module file or a specific
			//		function
			// extra: String?
			//		some additional message for the user
			// example:
			//	| dojo.experimental("dojo.data.Result");
			// example:
			//	| dojo.experimental("dojo.weather.toKelvin()", "PENDING approval from NOAA");

			var message = "EXPERIMENTAL: " + moduleName + " -- APIs subject to change without notice.";
			if(extra){ message += " " + extra; }
			console.warn(message);
		};
	}

	has.add("dojo-modulePaths",
		// consume dojo.modulePaths processing
		1
	);
	if(has("dojo-modulePaths")){
		// notice that modulePaths won't be applied to any require's before the dojo/_base/kernel factory is run;
		// this is the v1.6- behavior.
		if(config.modulePaths){
			dojo.deprecated("dojo.modulePaths", "use paths configuration");
			var paths = {};
			for(p in config.modulePaths){
				paths[p.replace(/\./g, "/")] = config.modulePaths[p];
			}
			require({paths:paths});
		}
	}

	has.add("dojo-moduleUrl",
		// include dojo.moduleUrl
		1
	);
	if(has("dojo-moduleUrl")){
		dojo.moduleUrl = function(/*String*/module, /*String?*/url){
			// summary:
			//		Returns a URL relative to a module.
			// example:
			//	|	var pngPath = dojo.moduleUrl("acme","images/small.png");
			//	|	console.dir(pngPath); // list the object properties
			//	|	// create an image and set it's source to pngPath's value:
			//	|	var img = document.createElement("img");
			//	|	img.src = pngPath;
			//	|	// add our image to the document
			//	|	dojo.body().appendChild(img);
			// example:
			//		you may de-reference as far as you like down the package
			//		hierarchy.  This is sometimes handy to avoid lengthy relative
			//		urls or for building portable sub-packages. In this example,
			//		the `acme.widget` and `acme.util` directories may be located
			//		under different roots (see `dojo.registerModulePath`) but the
			//		the modules which reference them can be unaware of their
			//		relative locations on the filesystem:
			//	|	// somewhere in a configuration block
			//	|	dojo.registerModulePath("acme.widget", "../../acme/widget");
			//	|	dojo.registerModulePath("acme.util", "../../util");
			//	|
			//	|	// ...
			//	|
			//	|	// code in a module using acme resources
			//	|	var tmpltPath = dojo.moduleUrl("acme.widget","templates/template.html");
			//	|	var dataPath = dojo.moduleUrl("acme.util","resources/data.json");

			dojo.deprecated("dojo.moduleUrl()", "use require.toUrl", "2.0");

			// require.toUrl requires a filetype; therefore, just append the suffix "/*.*" to guarantee a filetype, then
			// remove the suffix from the result. This way clients can request a url w/out a filetype. This should be
			// rare, but it maintains backcompat for the v1.x line (note: dojo.moduleUrl will be removed in v2.0).
			// Notice * is an illegal filename so it won't conflict with any real path map that may exist the paths config.
			var result = null;
			if(module){
				result = require.toUrl(module.replace(/\./g, "/") + (url ? ("/" + url) : "") + "/*.*").replace(/\/\*\.\*/, "") + (url ? "" : "/");
			}
			return result;
		};
	}

	dojo._hasResource = {}; // for backward compatibility with layers built with 1.6 tooling

	return dojo;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 585:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(621), __webpack_require__.dj.c(module.i), __webpack_require__.dj.m(module)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(global, require, module){
	// module:
	//		dojo/has
	// summary:
	//		Defines the has.js API and several feature tests used by dojo.
	// description:
	//		This module defines the has API as described by the project has.js with the following additional features:
	//
	//		- the has test cache is exposed at has.cache.
	//		- the method has.add includes a forth parameter that controls whether or not existing tests are replaced
	//		- the loader's has cache may be optionally copied into this module's has cahce.
	//
	//		This module adopted from https://github.com/phiggins42/has.js; thanks has.js team!

	// try to pull the has implementation from the loader; both the dojo loader and bdLoad provide one
	// if using a foreign loader, then the has cache may be initialized via the config object for this module
	// WARNING: if a foreign loader defines require.has to be something other than the has.js API, then this implementation fail
	var has = require.has || function(){};
	if(!has("dojo-has-api")){
		var
			isBrowser =
				// the most fundamental decision: are we in the browser?
				typeof window != "undefined" &&
				typeof location != "undefined" &&
				typeof document != "undefined" &&
				window.location == location && window.document == document,

			// has API variables
			doc = isBrowser && document,
			element = doc && doc.createElement("DiV"),
			cache = (module.config && module.config()) || {};

		has = function(name){
			// summary:
			//		Return the current value of the named feature.
			//
			// name: String|Integer
			//		The name (if a string) or identifier (if an integer) of the feature to test.
			//
			// description:
			//		Returns the value of the feature named by name. The feature must have been
			//		previously added to the cache by has.add.

			return typeof cache[name] == "function" ? (cache[name] = cache[name](global, doc, element)) : cache[name]; // Boolean
		};

		has.cache = cache;

		has.add = function(name, test, now, force){
			// summary:
			//	 	Register a new feature test for some named feature.
			// name: String|Integer
			//	 	The name (if a string) or identifier (if an integer) of the feature to test.
			// test: Function
			//		 A test function to register. If a function, queued for testing until actually
			//		 needed. The test function should return a boolean indicating
			//	 	the presence of a feature or bug.
			// now: Boolean?
			//		 Optional. Omit if `test` is not a function. Provides a way to immediately
			//		 run the test and cache the result.
			// force: Boolean?
			//	 	Optional. If the test already exists and force is truthy, then the existing
			//	 	test will be replaced; otherwise, add does not replace an existing test (that
			//	 	is, by default, the first test advice wins).
			// example:
			//		A redundant test, testFn with immediate execution:
			//	|	has.add("javascript", function(){ return true; }, true);
			//
			// example:
			//		Again with the redundantness. You can do this in your tests, but we should
			//		not be doing this in any internal has.js tests
			//	|	has.add("javascript", true);
			//
			// example:
			//		Three things are passed to the testFunction. `global`, `document`, and a generic element
			//		from which to work your test should the need arise.
			//	|	has.add("bug-byid", function(g, d, el){
			//	|		// g	== global, typically window, yadda yadda
			//	|		// d	== document object
			//	|		// el == the generic element. a `has` element.
			//	|		return false; // fake test, byid-when-form-has-name-matching-an-id is slightly longer
			//	|	});

			(typeof cache[name]=="undefined" || force) && (cache[name]= test);
			return now && has(name);
		};

		// since we're operating under a loader that doesn't provide a has API, we must explicitly initialize
		// has as it would have otherwise been initialized by the dojo loader; use has.add to the builder
		// can optimize these away iff desired
		has.add("host-browser", isBrowser);
		has.add("host-node", (typeof process == "object" && process.versions && process.versions.node && process.versions.v8));
		has.add("host-rhino", (typeof load == "function" && (typeof Packages == "function" || typeof Packages == "object")));
		has.add("dom", isBrowser);
		has.add("dojo-dom-ready-api", 1);
		has.add("dojo-sniff", 1);
	}

	if(has("host-browser")){
		// Common application level tests
		has.add("dom-addeventlistener", !!document.addEventListener);

		// Do the device and browser have touch capability?
		has.add("touch", "ontouchstart" in document
			|| ("onpointerdown" in document && navigator.maxTouchPoints > 0)
			|| window.navigator.msMaxTouchPoints);

		// Touch events support
		has.add("touch-events", "ontouchstart" in document);

		// Test if pointer events are supported and enabled, with either standard names ("pointerdown" etc.) or
		// IE specific names ("MSPointerDown" etc.).  Tests are designed to work on embedded C# WebBrowser Controls
		// in addition to IE, Edge, and future versions of Firefox and Chrome.
		// Note that on IE11, has("pointer-events") and has("MSPointer") are both true.
		has.add("pointer-events", "pointerEnabled" in window.navigator ?
				window.navigator.pointerEnabled : "PointerEvent" in window);
		has.add("MSPointer", window.navigator.msPointerEnabled);
		// The "pointermove"" event is only continuously emitted in a touch environment if
		// the target node's "touch-action"" CSS property is set to "none"
		// https://www.w3.org/TR/pointerevents/#the-touch-action-css-property
		has.add("touch-action", has("touch") && has("pointer-events"));

		// I don't know if any of these tests are really correct, just a rough guess
		has.add("device-width", screen.availWidth || innerWidth);

		// Tests for DOMNode.attributes[] behavior:
		//	 - dom-attributes-explicit - attributes[] only lists explicitly user specified attributes
		//	 - dom-attributes-specified-flag (IE8) - need to check attr.specified flag to skip attributes user didn't specify
		//	 - Otherwise, in IE6-7. attributes[] will list hundreds of values, so need to do outerHTML to get attrs instead.
		var form = document.createElement("form");
		has.add("dom-attributes-explicit", form.attributes.length == 0); // W3C
		has.add("dom-attributes-specified-flag", form.attributes.length > 0 && form.attributes.length < 40);	// IE8
	}

	has.clearElement = function(element){
		// summary:
		//	 Deletes the contents of the element passed to test functions.
		element.innerHTML= "";
		return element;
	};

	has.normalize = function(id, toAbsMid){
		// summary:
		//	 Resolves id into a module id based on possibly-nested tenary expression that branches on has feature test value(s).
		//
		// toAbsMid: Function
		//	 Resolves a relative module id into an absolute module id
		var
			tokens = id.match(/[\?:]|[^:\?]*/g), i = 0,
			get = function(skip){
				var term = tokens[i++];
				if(term == ":"){
					// empty string module name, resolves to 0
					return 0;
				}else{
					// postfixed with a ? means it is a feature to branch on, the term is the name of the feature
					if(tokens[i++] == "?"){
						if(!skip && has(term)){
							// matched the feature, get the first value from the options
							return get();
						}else{
							// did not match, get the second value, passing over the first
							get(true);
							return get(skip);
						}
					}
					// a module
					return term || 0;
				}
			};
		id = get();
		return id && toAbsMid(id);
	};

	has.load = function(id, parentRequire, loaded){
		// summary:
		//		Conditional loading of AMD modules based on a has feature test value.
		// id: String
		//		Gives the resolved module id to load.
		// parentRequire: Function
		//		The loader require function with respect to the module that contained the plugin resource in it's
		//		dependency list.
		// loaded: Function
		//	 Callback to loader that consumes result of plugin demand.

		if(id){
			parentRequire([id], loaded);
		}else{
			loaded();
		}
	};

	return has;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 588:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(585)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(has){
	// module:
	//		dojo/sniff

	/*=====
	return function(){
		// summary:
		//		This module sets has() flags based on the current browser.
		//		It returns the has() function.
	};
	=====*/

	if(has("host-browser")){
		var n = navigator,
			dua = n.userAgent,
			dav = n.appVersion,
			tv = parseFloat(dav);
		has.add("air", dua.indexOf("AdobeAIR") >= 0);
		has.add("wp", parseFloat(dua.split("Windows Phone")[1]) || undefined);
		has.add("msapp", parseFloat(dua.split("MSAppHost/")[1]) || undefined);
		has.add("khtml", dav.indexOf("Konqueror") >= 0 ? tv : undefined);
		has.add("edge", parseFloat(dua.split("Edge/")[1]) || undefined);
		has.add("opr", parseFloat(dua.split("OPR/")[1]) || undefined);
		// NOTE: https://dev.opera.com/blog/opera-user-agent-strings-opera-15-and-beyond/
		has.add("webkit", !has("wp") // NOTE: necessary since Windows Phone 8.1 Update 1, see #18540
			&& !has("edge") && parseFloat(dua.split("WebKit/")[1]) || undefined);
		has.add("chrome", !has("edge") && !has("opr")
				&& parseFloat(dua.split("Chrome/")[1]) || undefined);
		has.add("android", !has("wp") // NOTE: necessary since Windows Phone 8.1 Update 1, see #18528
				&& parseFloat(dua.split("Android ")[1]) || undefined);
		has.add("safari", dav.indexOf("Safari") >= 0
				&& !has("wp") // NOTE: necessary since Windows Phone 8.1 Update 1, see #18540
				&& !has("chrome") && !has("android") && !has("edge") && !has("opr") ?
			parseFloat(dav.split("Version/")[1]) : undefined);
		has.add("mac", dav.indexOf("Macintosh") >= 0);
		has.add("quirks", document.compatMode == "BackCompat");
		if(!has("wp") // NOTE: necessary since Windows Phone 8.1 Update 1, see #18528
				&& dua.match(/(iPhone|iPod|iPad)/)){
			var p = RegExp.$1.replace(/P/, "p");
			var v = dua.match(/OS ([\d_]+)/) ? RegExp.$1 : "1";
			var os = parseFloat(v.replace(/_/, ".").replace(/_/g, ""));
			has.add(p, os);		// "iphone", "ipad" or "ipod"
			has.add("ios", os);
		}
		has.add("bb", (dua.indexOf("BlackBerry") >= 0 || dua.indexOf("BB10") >= 0) && parseFloat(dua.split("Version/")[1]) || undefined);
		has.add("trident", parseFloat(dav.split("Trident/")[1]) || undefined);

		has.add("svg", typeof SVGAngle !== "undefined");

		if(!has("webkit")){
			// Opera
			if(dua.indexOf("Opera") >= 0){
				// see http://dev.opera.com/articles/view/opera-ua-string-changes and http://www.useragentstring.com/pages/Opera/
				// 9.8 has both styles; <9.8, 9.9 only old style
				has.add("opera", tv >= 9.8 ? parseFloat(dua.split("Version/")[1]) || tv : tv);
			}

			// Mozilla and firefox
			if(dua.indexOf("Gecko") >= 0 && !has("wp") // NOTE: necessary since Windows Phone 8.1 Update 1
					&& !has("khtml") && !has("trident") && !has("edge")){
				has.add("mozilla", tv);
			}
			if(has("mozilla")){
				//We really need to get away from this. Consider a sane isGecko approach for the future.
				has.add("ff", parseFloat(dua.split("Firefox/")[1] || dua.split("Minefield/")[1]) || undefined);
			}

			// IE
			if(document.all && !has("opera")){
				var isIE = parseFloat(dav.split("MSIE ")[1]) || undefined;

				//In cases where the page has an HTTP header or META tag with
				//X-UA-Compatible, then it is in emulation mode.
				//Make sure isIE reflects the desired version.
				//document.documentMode of 5 means quirks mode.
				//Only switch the value if documentMode's major version
				//is different from isIE's major version.
				var mode = document.documentMode;
				if(mode && mode != 5 && Math.floor(isIE) != mode){
					isIE = mode;
				}

				has.add("ie", isIE);
			}

			// Wii
			has.add("wii", typeof opera != "undefined" && opera.wiiremote);
		}
	}

	return has;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 610:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(621), __webpack_require__(585), __webpack_require__.dj.c(module.i)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(global, has, require){
	// module:
	//		dojo/_base/config

/*=====
return {
	// summary:
	//		This module defines the user configuration during bootstrap.
	// description:
	//		By defining user configuration as a module value, an entire configuration can be specified in a build,
	//		thereby eliminating the need for sniffing and or explicitly setting in the global variable dojoConfig.
	//		Also, when multiple instances of dojo exist in a single application, each will necessarily be located
	//		at an unique absolute module identifier as given by the package configuration. Implementing configuration
	//		as a module allows for specifying unique, per-instance configurations.
	// example:
	//		Create a second instance of dojo with a different, instance-unique configuration (assume the loader and
	//		dojo.js are already loaded).
	//		|	// specify a configuration that creates a new instance of dojo at the absolute module identifier "myDojo"
	//		|	require({
	//		|		packages:[{
	//		|			name:"myDojo",
	//		|			location:".", //assume baseUrl points to dojo.js
	//		|		}]
	//		|	});
	//		|
	//		|	// specify a configuration for the myDojo instance
	//		|	define("myDojo/config", {
	//		|		// normal configuration variables go here, e.g.,
	//		|		locale:"fr-ca"
	//		|	});
	//		|
	//		|	// load and use the new instance of dojo
	//		|	require(["myDojo"], function(dojo){
	//		|		// dojo is the new instance of dojo
	//		|		// use as required
	//		|	});

	// isDebug: Boolean
	//		Defaults to `false`. If set to `true`, ensures that Dojo provides
	//		extended debugging feedback to the console.
	isDebug: false,

	// locale: String
	//		The locale to assume for loading localized resources in this page,
	//		specified according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		Must be specified entirely in lowercase, e.g. `en-us` and `zh-cn`.
	//		See the documentation for `dojo.i18n` and `dojo.requireLocalization`
	//		for details on loading localized resources. If no locale is specified,
	//		Dojo assumes the locale of the user agent, according to `navigator.userLanguage`
	//		or `navigator.language` properties.
	locale: undefined,

	// extraLocale: Array
	//		No default value. Specifies additional locales whose
	//		resources should also be loaded alongside the default locale when
	//		calls to `dojo.requireLocalization()` are processed.
	extraLocale: undefined,

	// baseUrl: String
	//		The directory in which `dojo.js` is located. Under normal
	//		conditions, Dojo auto-detects the correct location from which it
	//		was loaded. You may need to manually configure `baseUrl` in cases
	//		where you have renamed `dojo.js` or in which `<base>` tags confuse
	//		some browsers (e.g. IE 6). The variable `dojo.baseUrl` is assigned
	//		either the value of `djConfig.baseUrl` if one is provided or the
	//		auto-detected root if not. Other modules are located relative to
	//		this path. The path should end in a slash.
	baseUrl: undefined,

	// modulePaths: [deprecated] Object
	//		A map of module names to paths relative to `dojo.baseUrl`. The
	//		key/value pairs correspond directly to the arguments which
	//		`dojo.registerModulePath` accepts. Specifying
	//		`djConfig.modulePaths = { "foo": "../../bar" }` is the equivalent
	//		of calling `dojo.registerModulePath("foo", "../../bar");`. Multiple
	//		modules may be configured via `djConfig.modulePaths`.
	modulePaths: {},

	// addOnLoad: Function|Array
	//		Adds a callback via dojo/ready. Useful when Dojo is added after
	//		the page loads and djConfig.afterOnLoad is true. Supports the same
	//		arguments as dojo/ready. When using a function reference, use
	//		`djConfig.addOnLoad = function(){};`. For object with function name use
	//		`djConfig.addOnLoad = [myObject, "functionName"];` and for object with
	//		function reference use
	//		`djConfig.addOnLoad = [myObject, function(){}];`
	addOnLoad: null,

	// parseOnLoad: Boolean
	//		Run the parser after the page is loaded
	parseOnLoad: false,

	// require: String[]
	//		An array of module names to be loaded immediately after dojo.js has been included
	//		in a page.
	require: [],

	// defaultDuration: Number
	//		Default duration, in milliseconds, for wipe and fade animations within dijits.
	//		Assigned to dijit.defaultDuration.
	defaultDuration: 200,

	// dojoBlankHtmlUrl: String
	//		Used by some modules to configure an empty iframe. Used by dojo/io/iframe and
	//		dojo/back, and dijit/popup support in IE where an iframe is needed to make sure native
	//		controls do not bleed through the popups. Normally this configuration variable
	//		does not need to be set, except when using cross-domain/CDN Dojo builds.
	//		Save dojo/resources/blank.html to your domain and set `djConfig.dojoBlankHtmlUrl`
	//		to the path on your domain your copy of blank.html.
	dojoBlankHtmlUrl: undefined,

	// ioPublish: Boolean?
	//		Set this to true to enable publishing of topics for the different phases of
	//		IO operations. Publishing is done via dojo/topic.publish(). See dojo/main.__IoPublish for a list
	//		of topics that are published.
	ioPublish: false,

	// transparentColor: Array
	//		Array containing the r, g, b components used as transparent color in dojo.Color;
	//		if undefined, [255,255,255] (white) will be used.
	transparentColor: undefined,
	
	// deps: Function|Array
	//		Defines dependencies to be used before the loader has been loaded.
	//		When provided, they cause the loader to execute require(deps, callback) 
	//		once it has finished loading. Should be used with callback.
	deps: undefined,
	
	// callback: Function|Array
	//		Defines a callback to be used when dependencies are defined before 
	//		the loader has been loaded. When provided, they cause the loader to 
	//		execute require(deps, callback) once it has finished loading. 
	//		Should be used with deps.
	callback: undefined,
	
	// deferredInstrumentation: Boolean
	//		Whether deferred instrumentation should be loaded or included
	//		in builds.
	deferredInstrumentation: true,

	// useDeferredInstrumentation: Boolean|String
	//		Whether the deferred instrumentation should be used.
	//
	//		* `"report-rejections"`: report each rejection as it occurs.
	//		* `true` or `1` or `"report-unhandled-rejections"`: wait 1 second
	//			in an attempt to detect unhandled rejections.
	useDeferredInstrumentation: "report-unhandled-rejections"
};
=====*/

	var result = {};
	if(has("dojo-config-api")){
		// must be the dojo loader; take a shallow copy of require.rawConfig
		var src = require.rawConfig, p;
		for(p in src){
			result[p] = src[p];
		}
	}else{
		var adviseHas = function(featureSet, prefix, booting){
			for(p in featureSet){
				p!="has" && has.add(prefix + p, featureSet[p], 0, booting);
			}
		};
		result = has("dojo-loader") ?
			// must be a built version of the dojo loader; all config stuffed in require.rawConfig
			require.rawConfig :
			// a foreign loader
			global.dojoConfig || global.djConfig || {};
		adviseHas(result, "config", 1);
		adviseHas(result.has, "", 1);
	}

	if(!result.locale && typeof navigator != "undefined"){
		// Default locale for browsers (ensure it's read from user-settings not download locale).
		var language = (navigator.languages && navigator.languages.length) ? navigator.languages[0] :
			(navigator.language || navigator.userLanguage);
		if(language){
			result.locale = language.toLowerCase();
		}
	}

	return result;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));



/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = (function(){
    if (typeof global !== 'undefined' && typeof global !== 'function') {
        // global spec defines a reference to the global object called 'global'
        // https://github.com/tc39/proposal-global
        // `global` is also defined in NodeJS
        return global;
    }
    else if (typeof window !== 'undefined') {
        // window is defined in browsers
        return window;
    }
    else if (typeof self !== 'undefined') {
        // self is defined in WebWorkers
        return self;
    }
    return this;
}).call(null, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 92:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(584), __webpack_require__(585), __webpack_require__(331)], __WEBPACK_AMD_DEFINE_RESULT__ = (function(dojo, has, lang){
	// module:
	//		dojo/_base/array

	// our old simple function builder stuff
	var cache = {}, u;

	function buildFn(fn){
		return cache[fn] = new Function("item", "index", "array", fn); // Function
	}
	// magic snippet: if(typeof fn == "string") fn = cache[fn] || buildFn(fn);

	// every & some

	function everyOrSome(some){
		var every = !some;
		return function(a, fn, o){
			var i = 0, l = a && a.length || 0, result;
			if(l && typeof a == "string") a = a.split("");
			if(typeof fn == "string") fn = cache[fn] || buildFn(fn);
			if(o){
				for(; i < l; ++i){
					result = !fn.call(o, a[i], i, a);
					if(some ^ result){
						return !result;
					}
				}
			}else{
				for(; i < l; ++i){
					result = !fn(a[i], i, a);
					if(some ^ result){
						return !result;
					}
				}
			}
			return every; // Boolean
		};
	}

	// indexOf, lastIndexOf

	function index(up){
		var delta = 1, lOver = 0, uOver = 0;
		if(!up){
			delta = lOver = uOver = -1;
		}
		return function(a, x, from, last){
			if(last && delta > 0){
				// TODO: why do we use a non-standard signature? why do we need "last"?
				return array.lastIndexOf(a, x, from);
			}
			var l = a && a.length || 0, end = up ? l + uOver : lOver, i;
			if(from === u){
				i = up ? lOver : l + uOver;
			}else{
				if(from < 0){
					i = l + from;
					if(i < 0){
						i = lOver;
					}
				}else{
					i = from >= l ? l + uOver : from;
				}
			}
			if(l && typeof a == "string") a = a.split("");
			for(; i != end; i += delta){
				if(a[i] == x){
					return i; // Number
				}
			}
			return -1; // Number
		};
	}

	var array = {
		// summary:
		//		The Javascript v1.6 array extensions.

		every: everyOrSome(false),
		/*=====
		 every: function(arr, callback, thisObject){
			 // summary:
			 //		Determines whether or not every item in arr satisfies the
			 //		condition implemented by callback.
			 // arr: Array|String
			 //		the array to iterate on. If a string, operates on individual characters.
			 // callback: Function|String
			 //		a function is invoked with three arguments: item, index,
			 //		and array and returns true if the condition is met.
			 // thisObject: Object?
			 //		may be used to scope the call to callback
			 // returns: Boolean
			 // description:
			 //		This function corresponds to the JavaScript 1.6 Array.every() method, with one difference: when
			 //		run over sparse arrays, this implementation passes the "holes" in the sparse array to
			 //		the callback function with a value of undefined. JavaScript 1.6's every skips the holes in the sparse array.
			 //		For more details, see:
			 //		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
			 // example:
			 //	|	// returns false
			 //	|	array.every([1, 2, 3, 4], function(item){ return item>1; });
			 // example:
			 //	|	// returns true
			 //	|	array.every([1, 2, 3, 4], function(item){ return item>0; });
		 },
		 =====*/

		some: everyOrSome(true),
		/*=====
		some: function(arr, callback, thisObject){
			// summary:
			//		Determines whether or not any item in arr satisfies the
			//		condition implemented by callback.
			// arr: Array|String
			//		the array to iterate over. If a string, operates on individual characters.
			// callback: Function|String
			//		a function is invoked with three arguments: item, index,
			//		and array and returns true if the condition is met.
			// thisObject: Object?
			//		may be used to scope the call to callback
			// returns: Boolean
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.some() method, with one difference: when
			//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's some skips the holes in the sparse array.
			//		For more details, see:
			//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/some
			// example:
			//	| // is true
			//	| array.some([1, 2, 3, 4], function(item){ return item>1; });
			// example:
			//	| // is false
			//	| array.some([1, 2, 3, 4], function(item){ return item<1; });
		},
		=====*/

		indexOf: index(true),
		/*=====
		indexOf: function(arr, value, fromIndex, findLast){
			// summary:
			//		locates the first index of the provided value in the
			//		passed array. If the value is not found, -1 is returned.
			// description:
			//		This method corresponds to the JavaScript 1.6 Array.indexOf method, with two differences:
			//
			//		1. when run over sparse arrays, the Dojo function invokes the callback for every index
			//		   whereas JavaScript 1.6's indexOf skips the holes in the sparse array.
			//		2. uses equality (==) rather than strict equality (===)
			//
			//		For details on this method, see:
			//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf
			// arr: Array
			// value: Object
			// fromIndex: Integer?
			// findLast: Boolean?
			//		Makes indexOf() work like lastIndexOf().  Used internally; not meant for external usage.
			// returns: Number
		},
		=====*/

		lastIndexOf: index(false),
		/*=====
		lastIndexOf: function(arr, value, fromIndex){
			// summary:
			//		locates the last index of the provided value in the passed
			//		array. If the value is not found, -1 is returned.
			// description:
		 	//		This method corresponds to the JavaScript 1.6 Array.lastIndexOf method, with two differences:
		 	//
		 	//		1. when run over sparse arrays, the Dojo function invokes the callback for every index
		 	//		   whereas JavaScript 1.6's lasIndexOf skips the holes in the sparse array.
		 	//		2. uses equality (==) rather than strict equality (===)
		 	//
		 	//		For details on this method, see:
		 	//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/lastIndexOf
			// arr: Array,
			// value: Object,
			// fromIndex: Integer?
			// returns: Number
		},
		=====*/

		forEach: function(arr, callback, thisObject){
			// summary:
			//		for every item in arr, callback is invoked. Return values are ignored.
			//		If you want to break out of the loop, consider using array.every() or array.some().
			//		forEach does not allow breaking out of the loop over the items in arr.
			// arr:
			//		the array to iterate over. If a string, operates on individual characters.
			// callback:
			//		a function is invoked with three arguments: item, index, and array
			// thisObject:
			//		may be used to scope the call to callback
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.forEach() method, with one difference: when
			//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's forEach skips the holes in the sparse array.
			//		For more details, see:
			//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
			// example:
			//	| // log out all members of the array:
			//	| array.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		function(item){
			//	|			console.log(item);
			//	|		}
			//	| );
			// example:
			//	| // log out the members and their indexes
			//	| array.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		function(item, idx, arr){
			//	|			console.log(item, "at index:", idx);
			//	|		}
			//	| );
			// example:
			//	| // use a scoped object member as the callback
			//	|
			//	| var obj = {
			//	|		prefix: "logged via obj.callback:",
			//	|		callback: function(item){
			//	|			console.log(this.prefix, item);
			//	|		}
			//	| };
			//	|
			//	| // specifying the scope function executes the callback in that scope
			//	| array.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		obj.callback,
			//	|		obj
			//	| );
			//	|
			//	| // alternately, we can accomplish the same thing with lang.hitch()
			//	| array.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		lang.hitch(obj, "callback")
			//	| );
			// arr: Array|String
			// callback: Function|String
			// thisObject: Object?

			var i = 0, l = arr && arr.length || 0;
			if(l && typeof arr == "string") arr = arr.split("");
			if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
			if(thisObject){
				for(; i < l; ++i){
					callback.call(thisObject, arr[i], i, arr);
				}
			}else{
				for(; i < l; ++i){
					callback(arr[i], i, arr);
				}
			}
		},

		map: function(arr, callback, thisObject, Ctr){
			// summary:
			//		applies callback to each element of arr and returns
			//		an Array with the results
			// arr: Array|String
			//		the array to iterate on. If a string, operates on
			//		individual characters.
			// callback: Function|String
			//		a function is invoked with three arguments, (item, index,
			//		array),	 and returns a value
			// thisObject: Object?
			//		may be used to scope the call to callback
			// returns: Array
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.map() method, with one difference: when
			//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's map skips the holes in the sparse array.
			//		For more details, see:
			//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
			// example:
			//	| // returns [2, 3, 4, 5]
			//	| array.map([1, 2, 3, 4], function(item){ return item+1 });

			// TODO: why do we have a non-standard signature here? do we need "Ctr"?
			var i = 0, l = arr && arr.length || 0, out = new (Ctr || Array)(l);
			if(l && typeof arr == "string") arr = arr.split("");
			if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
			if(thisObject){
				for(; i < l; ++i){
					out[i] = callback.call(thisObject, arr[i], i, arr);
				}
			}else{
				for(; i < l; ++i){
					out[i] = callback(arr[i], i, arr);
				}
			}
			return out; // Array
		},

		filter: function(arr, callback, thisObject){
			// summary:
			//		Returns a new Array with those items from arr that match the
			//		condition implemented by callback.
			// arr: Array
			//		the array to iterate over.
			// callback: Function|String
			//		a function that is invoked with three arguments (item,
			//		index, array). The return of this function is expected to
			//		be a boolean which determines whether the passed-in item
			//		will be included in the returned array.
			// thisObject: Object?
			//		may be used to scope the call to callback
			// returns: Array
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.filter() method, with one difference: when
			//		run over sparse arrays, this implementation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's filter skips the holes in the sparse array.
			//		For more details, see:
			//		https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
			// example:
			//	| // returns [2, 3, 4]
			//	| array.filter([1, 2, 3, 4], function(item){ return item>1; });

			// TODO: do we need "Ctr" here like in map()?
			var i = 0, l = arr && arr.length || 0, out = [], value;
			if(l && typeof arr == "string") arr = arr.split("");
			if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
			if(thisObject){
				for(; i < l; ++i){
					value = arr[i];
					if(callback.call(thisObject, value, i, arr)){
						out.push(value);
					}
				}
			}else{
				for(; i < l; ++i){
					value = arr[i];
					if(callback(value, i, arr)){
						out.push(value);
					}
				}
			}
			return out; // Array
		},

		clearCache: function(){
			cache = {};
		}
	};


	has("extend-dojo") && lang.mixin(dojo, array);

	return array;
}).apply(null, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

});
//# sourceMappingURL=2.bundle.js.map