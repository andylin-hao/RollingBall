/* Ciuvo Addon SDK 2.1.3 | (c) 2011-2017 Ciuvo GmbH CIUVO CONFIDENTIAL All Rights Reserved.
NOTICE: All information contained herein is, and remains the property of  Ciuvo GmbH and its suppliers, if any. The intellectual and technical  concepts contained herein are proprietary to Ciuvo GmbH and its suppliers  and may be covered by U.S. and Foreign Patents, patents in process, and are  protected by trade secret or copyright law. Dissemination of this information  or reproduction of this material is strictly forbidden unless prior written  permission is obtained from Ciuvo GmbH.
Copyright 2011-2017 Ciuvo GmbH. Contact support@ciuvo.com for more details.

Includes jQuery | (c) jQuery Foundation and other contributors | https://jquery.org/
Includes requirejs/almond | (c) jQuery Foundation and other contributors  | https://github.com/requirejs/almond/blob/master/LICENSE
Includes json2.js | http://www.JSON.org/js.html */
(function (root, factory) {
    /**
    if (typeof define === "function") {
        define(factory);
    } else if (typeof exports === "object") {
        module.exports = factory();
    } else {
    */
        root.ciuvoSDK = factory();
    // }
}(this, function () {
/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define('constants',{
    version: "2.1.3",
    base_url: "https://api.ciuvo.com/api/",
    media_host_url: "https://ciuvo.com/",
    get_url: function(name, settings) {
        switch(name) {
        case "api":
            return settings.base_url || this.base_url;
        case "storage":
            return (settings.media_host_url || this.media_host_url) + 'ciuvo/globalstorage';
        case "bundle":
            return (settings.media_host_url || this.media_host_url) + 'ciuvo/templates/';
        case "media":
            return settings.media_host_url || this.media_host_url;
        case "analyze":
            return (settings.base_url || this.base_url) + 'analyze';
        case "voucher":
            return (settings.base_url || this.base_url) + 'voucher';
        case "whitelist":
            return (settings.base_url || this.base_url) + 'whitelist';
        default:
            throw "invalid url specifier";
        }
    }
});

/*
 * Copyright 2011-2015 Ciuvo GmbH. All rights reserved.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */

// Important: import list needs to be empty, otherwise debug will be added automatically.
define('request',[], function() {
    
    var IE_SEND_TIMEOUT = 200,
        TYPE_XDR = "XDR",
        TYPE_XHR = "XHR";

    /**
     * Class to abstract the various available implementations of XMLHttpRequest
     * published by browser vendors - we do assume that there are currently
     * only two major implementations available for cross domain requests:
     *
     *   XMLHttpRequest
     *   XDomainRequest
     *
     * @constructor
     */
    var AjaxRequest = function(method, url, params) {
        this.method = method;
        this.url = url;
        this.requestTimer = undefined;
        this.type = TYPE_XHR;
        this.rq = new window.XMLHttpRequest();

        if ("withCredentials" in this.rq) {
            // pass
        }
        else if (typeof window.XDomainRequest !== "undefined") {
            this.type = TYPE_XDR;
            this.rq = new window.XDomainRequest();
            this.rq.readyState = 1;
        }

        if (typeof params === "object") {
            var seperator = this.url.indexOf("?") === -1 ? "?" : "&";
            for (var key in params) {
                if (typeof params[key] !== "undefined") {
                    this.url += seperator + key + "=" + encodeURIComponent(params[key]);
                    seperator = "&";
                }
            }
        }

        this.rq.open(method, this.url, true);

        if (this.type === TYPE_XDR) {
            // IE XDR abort fix: Initialize event handlers with noops
            // @see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/30ef3add-767c-4436-b8a9-f1ca19b4812e/
            this.rq.onprogress = function() {};
            this.rq.ontimeout = function() {};
            this.rq.onerror = function() {};
            this.rq.onload = function() {};
            this.rq.timeout = 0;
        }
    };

    AjaxRequest.prototype = {
        wrapCallback: function(callback) {
            var self = this;
            return function(result) {
                self.clearTimeout();
                callback(self.rq, result);
            };
        },

        /**
         * Sets the method to be called when the readystate changes.
         * @param callback
         */
        onReadyStateChange: function(callback) {
            if (this.type === TYPE_XDR) {
                this.rq.readyState = 3;
                this.rq.status = 200;
                this.rq.onload = this.wrapCallback(callback);
            }
            else {
                this.rq.onreadystatechange = this.wrapCallback(callback);
            }
        },

        /**
         * Sets the method to be called when the request has loaded.
         * @param callback
         */
        onLoad: function(callback) {
            if (this.type === TYPE_XDR) {
                this.rq.readyState = 3;
                this.rq.status = 200;
            }
            this.rq.onload = this.wrapCallback(callback);
        },

        /**
         * Sets the method to be called when the request has loaded.
         * @param callback
         */
        onError: function(callback) {
            if (this.type === TYPE_XDR) {
                this.rq.readyState = 3;
                this.rq.status = 500;
            }
            this.rq.onerror = this.wrapCallback(callback);
        },

        /**
         * Sets a header value for the request object.
         * @param header
         * @param value
         */
        setHeader: function(header, value) {
            if ("setRequestHeader" in this.rq) {
                this.rq.setRequestHeader(header, value);
            }
        },

        setTimeout: function(timeout, callback) {
            this.timeout = timeout;
            this.timeoutCallback = callback;
        },

        abort: function() {
            if (this.rq) {
                this.rq.abort();
            }
        },

        /**
         * Sets up timeouts, this may be overridden i.e. if window is undefined.
         * NOTE: Do not confuse with setTimeout().
         */
        setupTimeoutTimer: function(timeout) {
            // Check if a timeout has been configured and setup hooks
            if (typeof timeout === "number") {
                var self = this;
                window.setTimeout(function() {
                    self.rq.abort();
                    if (typeof self.timeoutCallback === "function") {
                        self.timeoutCallback();
                    }
                }, timeout);
            }
        },

        clearTimeout: function() {
            window.clearTimeout(this.requestTimer);
            this.requestTimer = undefined;
        },

        /**
         * Submits the request.
         * @param data
         */
        send: function(data) {
            var self = this;
            
            this.setupTimeoutTimer(this.timeout);

            // IE needs some time to get started...
            // TODO: verify that this is still required for IE.
            if (this.type === TYPE_XDR) {
                // Do not unwrap .send method.
                // Required to run on a separate thread.
                window.setTimeout(function () {
                   self.rq.send(data);
                }, IE_SEND_TIMEOUT);
            } else {
                this.rq.send(data);
            }
        }
    };

    return {
        AjaxRequest: AjaxRequest
    };
});
define('utils',[],function() {

    /**
     * Utility that returns a comparison function depending on
     * the type passed.
     */
    function default_cmp(a, b) {
        if (a === b) {
            return 0;
        }
        return a < b ? -1 : 1;
    }

    function getCmpFunc(primer, reverse) {
        var cmp = default_cmp;
        if (primer) {
            cmp = function(a, b) {
                return default_cmp(primer(a), primer(b));
            };
        }
        if (reverse) {
            return function(a, b) {
                return -1 * cmp(a, b);
            };
        }
        return cmp;
    }

    /**
     * Create and return a "version 4" RFC-4122 UUID string.
     *
     * randomUUID.js - Version 1.0
     *
     * Copyright 2008, Robert Kieffer
     *
     * This software is made available under the terms of the Open Software
     * License v3.0
     * (available here: http://www.opensource.org/licenses/osl-3.0.php )
     *
     * The latest version of this file can be found at:
     * http://www.broofa.com/Tools/randomUUID.js
     *
     * For more information, or to comment on this, please go to:
     * http://www.broofa.com/blog/?p=151
     */
    function generateRandomUUID() {
        var s = [], itoh = "0123456789ABCDEF";

        // Make array of random hex digits. The UUID only has 32 digits in it,
        // but we allocate an extra items to make room for the '-'s we'll be
        // inserting.
        for (var i = 0; i < 36; i++) {
            s[i] = Math.floor(Math.random() * 0x10);
        }

        // Conform to RFC-4122, section 4.4
        s[14] = 4; // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (i = 0; i < 36; i++) {
            s[i] = itoh[s[i]];
        }

        // Insert '-'s
        s[8] = s[13] = s[18] = s[23] = "-";
        return s.join("");
    }

    function isEmptyObject(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    return {
        /**
         * Returns a stripped version of the passed URL that doesn't contain the URI.
         * @param url
         * @returns {*}
         */
        getHostname: function(url) {
            return url.match(/^(https?:\/\/.*?(?::\d+)?\/)/)[1];
        },

        sort: function(arr) {
            // Create field comparator functions
            var fields = [], field, name, cmp;
            for (var i = 1; i < arguments.length; i++) {
                field = arguments[i];
                if (typeof field === "string") {
                    name = field;
                    cmp = default_cmp;
                }
                else {
                    name = field.name;
                    cmp = getCmpFunc(field.primer, field.reverse);
                }
                fields.push({ name: name, cmp: cmp });
            }

            // Create final comparison function
            var compare = function(A, B) {
                var result = 0;
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    if (typeof A[field.name] === "undefined") {
                        continue;
                    }
                    result = field.cmp(A[field.name], B[field.name]);
                    if (result !== 0) {
                        break;
                    }
                }
                return result;
            };
            arr.sort(compare);
        },

        makeRandomString: function(length) {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

            for (var i=0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },

        settings_sanity_check: function(settings) {
            if (typeof settings !== "object") {
                throw "settings must be object";
            }

            if (!settings.tag) {
                throw "settings.tag is mandatory";
            }

            if (settings.url === "about:blank") {
                settings.url = undefined;
            }
        },

        generateRandomUUID: generateRandomUUID,

        isEmptyObject: isEmptyObject
    };
});
/**
 *
 */
define("whitelist", ["constants", "request", "utils"],
    function(constants, request, utils) {


        var Whitelist = function(settings) {
            utils.settings_sanity_check(settings);
            this.settings = settings;
            this.partner_tag = this.settings.tag;
            this.whitelist_url = constants.get_url('whitelist', settings);
        };

        Whitelist.prototype = {
            /**
             * @param url
             *         the url to be checked if it is whitelisted
             * @param callback
             *         a function to be invoked if the url is whitelisted
             * @param err_callback
             *         a function to invoed it the url is not whitelisted or the check fails.
             */
            isWhitelisted: function(url, callback, errback) {

                if (typeof callback !== "function") {
                    throw "callback must be function";
                }

                if (typeof errback !== "function") {
                    throw "errback must be function";
                }

                if (typeof url !== "string") {
                    throw "url must be a valid string";
                }

                var whitelist = this.cached_whitelist;
                if (typeof whitelist !== 'undefined' && whitelist.length) {
                    this._isWhitelisted(url, whitelist, callback, errback);
                } else {
                    var self = this;
                    this._loadWhitelist(function(whitelist) {
                        self.cached_whitelist = whitelist;
                        self._isWhitelisted(url, whitelist, callback, errback);
                    }, errback);
                }
            },

			/**
             *
			 */
            updateSettings: function(settings, data) {
                var update_keys = ['media_url', 'event_url', 'toolbar_template', 'partner_tag'];
                var updated_keys = [];
                for (var i=0; i<update_keys.length; i++) {
                    var key = update_keys[i];
                    if (data.hasOwnProperty(key) && data[key] !== com.ciuvo.setting(key) ) {
                        settings[key] = data[key];
                        updated_keys.push(key);
                    }
                }
            	return updated_keys;
        	},

            /**
             * @param url
             *         the url to be checked if it is whitelisted
             * @param whitelist
             *         the loaded whitelist
             * @param callback
             *         a function to be invoked if the url is whitelisted
             * @param err_callback
             *         a function to invoed it the url is not whitelisted or the check fails.
             */
            _isWhitelisted: function(url, whitelist, callback, errback) {
                if (this._urlInList(url, whitelist)) {
                    callback();
                } else {
                    errback();
                }
            },

            /**
             * @param callback
             * 
             * @param errback
             * 
             */
            _loadWhitelist: function(callback, errback) {
                var self = this;
                var url = this.whitelist_url
                    + '?o=lcs'
                    + '&v=' + encodeURIComponent(constants.version)
                    + '&uuid=' + encodeURIComponent(this.settings.uuid)
                    + '&tag=' + encodeURIComponent(this.partner_tag)
                    + '&campaign=' + encodeURIComponent(this.settings.campaign);

                if (this.settings['com.ciuvo.' + this.partner_tag + '-settings']) {
                    var get_settings = JSON.parse(this.settings['com.ciuvo.ciuvo-settings']);
                    if ( typeof get_settings !== 'undefined' ) {
                        url += "&cfg=" + encodeURIComponent( get_settings );
                    }
                }

                
                var req = new request.AjaxRequest('GET', url);
                req.jsonp = "whitelist";
                req.onLoad(function(requ, resp) {
                    try {
                        var data = requ.jsonpResponse || JSON.parse(requ.responseText);
                        var whitelist = data['com.ciuvo.lcs'] 
                                        || self._parseList(data['com.ciuvo.whitelist']);
                                                self.updateSettings(self.settings, data);
                        callback(whitelist);
                    } catch (e) {
                        errback(e);
                    }
                });

                req.onError(function(e) {
                                        errback(e);
                });

                req.send(null);
            },

            _parseList: function(list) {
                var target = [];
                if (typeof list === 'undefined') {
                    return target;
                }
                for (var i = 0, len = list.length; i < len; i++) {
                    var reg = new RegExp(list[i]);
                    target.push(reg);
                }
                return target;
            },

            _urlInList: function(url, urllist) {
                // iterate through all whitelist nodes
                var hostname = url.match(/^(https?:\/\/.*?\/)/)[1].toLowerCase();
                for (var i = 0, len = urllist.length; i < len; i++) {
                    if (hostname.indexOf(urllist[i]) > -1) {
                        return true;
                    }
                }
                return false;
            }
        };

        return {
            Whitelist: Whitelist
        };
    }
);

/**
 * The main module that defines the public interface for Ciuvo SDK.
 */
define("ciuvoSDK", ["constants"], function (constants) {
    var ciuvoSDK = { version: constants.version };
    require(['whitelist']);
    ciuvoSDK.Whitelist = require("whitelist").Whitelist;
    return ciuvoSDK;
});
    // wrap-end.frag.js
    // change "my-lib" to your 'entry-point' module name
    return require("ciuvoSDK");
}));
