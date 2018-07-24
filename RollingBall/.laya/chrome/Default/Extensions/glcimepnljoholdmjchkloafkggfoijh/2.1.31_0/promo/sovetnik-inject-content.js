(function(){/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	__webpack_require__(27);

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var messaging = __webpack_require__(28);
	var injectScript = __webpack_require__(30);
	var canUseSovetnik = __webpack_require__(32);
	var postMessageParser = __webpack_require__(33);
	var postMessage = __webpack_require__(34);

	var sovetnikRE = /^https?:\/\/sovetnik/;
	var sovetnikInfo = undefined;

	function initListeners() {
	    messaging.sendMessage({
	        type: 'getSovetnikInfo'
	    }, function (info) {
	        sovetnikInfo = info;

	        if (sovetnikInfo) {
	            canUseSovetnik(document.URL, document.referrer, function () {
	                if (typeof startSovetnik !== 'undefined') {
	                    startSovetnik(sovetnikInfo.settings);
	                } else {
	                    injectScript(document, sovetnikInfo.url, sovetnikInfo.settings);
	                }
	            });
	        }
	    });

	    postMessage.on(onMessage);
	}

	var commandHandlers = {
	    getDomainData: function getDomainData(message, origin) {
	        messaging.sendMessage({
	            type: 'getDomainData',
	            domain: message.data.domain
	        }, function (domainData) {
	            message.response = domainData;
	            postMessage.trigger(JSON.stringify(message), origin);
	        });
	    },

	    getSovetnikInfo: function getSovetnikInfo(message, origin) {
	        message.response = sovetnikInfo.settings;
	        postMessage.trigger(JSON.stringify(message), origin);
	    },

	    serverMessage: function serverMessage(message) {
	        messaging.sendMessage({
	            type: message.data.type,
	            domain: message.data.domain || window.location.host
	        });
	    },

	    showSettingsPage: function showSettingsPage() {
	        messaging.sendMessage({
	            type: 'showSettingsPage'
	        });
	    },

	    showNotification: function showNotification(message) {
	        messaging.sendMessage({
	            type: 'showNotification',
	            notification: message.data
	        });
	    },

	    clearNotification: function clearNotification(message) {
	        messaging.sendMessage({
	            type: 'clearNotification',
	            action: message.data
	        });
	    },

	    sovetnikProductResponse: function sovetnikProductResponse(message) {
	        messaging.sendMessage({
	            type: 'sovetnikProductResponse',
	            response: message.data
	        });
	    }
	};

	function onMessage(event) {
	    var message = postMessageParser.getMessageFromEvent(event);

	    if (message && sovetnikInfo && sovetnikInfo.settings) {
	        if (sovetnikInfo.settings.clid) {
	            if (sovetnikInfo.settings.clid != message.clid) {
	                return;
	            }
	        } else if (sovetnikInfo.settings.affId != message.affId) {
	            return;
	        }

	        //message from our script
	        if (message.command) {
	            commandHandlers[message.command](message, event.origin);
	        }
	    }
	}

	if (window && window.document && (window.self === window.top || sovetnikRE.test(window.location.href))) {
	    if (window.opera) {
	        if (window.document.readyState === 'complete' || window.document.readyState === 'interactive') {
	            initListeners();
	        } else {
	            window.document.addEventListener('DOMContentLoaded', initListeners, false);
	        }
	    } else {
	        initListeners();
	    }
	}

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var messaging = undefined;

	// #if chrome,opera,firefox-webextension
	messaging = __webpack_require__(29);
	// #end

	module.exports = messaging;

/***/ },

/***/ 29:
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	"use strict";

	var messaging = {
	    sendMessage: function sendMessage(msg, responseCallback) {
	        responseCallback = responseCallback || function () {};

	        chrome.runtime.sendMessage(msg, function () {
	            var args = arguments;
	            setTimeout(function () {
	                responseCallback.apply(this, args);
	            }, 0);
	        });

	        return this;
	    },

	    onMessage: function onMessage(listener) {
	        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	            return listener(request, sendResponse);
	        });
	    }
	};

	module.exports = messaging;

/***/ },

/***/ 30:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var injectScript = undefined;
	// #if chrome,opera,xul
	injectScript = __webpack_require__(31);
	// #end

	module.exports = injectScript;

/***/ },

/***/ 31:
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	function injectScript(doc, url, settings) {
	    var script = doc.createElement('script');
	    var params = [];

	    params.push('mbr=true');
	    params.push('settings=' + encodeURIComponent(JSON.stringify(settings)));
	    params = params.join('&');

	    url += '?' + params;

	    script.setAttribute('src', url);
	    script.setAttribute('type', 'text/javascript');
	    script.setAttribute('charset', 'UTF-8');

	    doc.body.appendChild(script);
	}

	module.exports = injectScript;

/***/ },

/***/ 32:
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var messaging = __webpack_require__(28);

	function canUseSovetnik(url, referrer, successCallback) {
	    messaging.sendMessage({
	        type: 'canUseSovetnik',
	        url: url,
	        referrer: referrer
	    }, function (res) {
	        if (res) {
	            successCallback();
	        }
	    });
	}

	module.exports = canUseSovetnik;

/***/ },

/***/ 33:
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var postMessageParser = {
	    /**
	     * return message if postMessage event was sent from our script
	     * @param {Object} event
	     * @param {Object} event.data
	     * @return {?Object}
	     */
	    getMessageFromEvent: function getMessageFromEvent(event) {
	        if (!event.data) {
	            return null;
	        }

	        var message = event.data;

	        if (typeof message === 'string') {
	            try {
	                message = JSON.parse(message);
	            } catch (ex) {
	                return null;
	            }
	        }

	        var isOurMessage = message && message.type === 'MBR_ENVIRONMENT' && !message.hasOwnProperty('response') && (message.clid || message.affId);

	        if (isOurMessage) {
	            return message;
	        }

	        return null;
	    }
	};

	module.exports = postMessageParser;

/***/ },

/***/ 34:
/***/ function(module, exports) {

	/**
	 * @callback postMessageCallback
	 * @param {Object} event
	 * @param {Object|String} event.data
	 */

	/**
	 * добавляем обработчик 'message' события. Для наших расширений общение реализуется с помощью нашей функции
	 * которая определяется в контент-скрипте. 
	 * 
	 * @param {postMessageCallback} listener
	 * @param {Boolean} forceUseOriginalPostMessage=false - показывает, что не нужно использовать нашу собственную функцию.
	 *                      Полезно, если мы хотим общаться со страницей (например со страницей настроек или с лендингом)
	 */
	'use strict';

	function addMessageListener(listener) {
	    var forceUseOriginalPostMessage = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    if (window.svtPostMessage && !forceUseOriginalPostMessage) {
	        window.svtPostMessage.on(listener);
	    } else {
	        if (window.addEventListener) {
	            window.addEventListener('message', listener);
	        } else {
	            window.attachEvent('onmessage', listener);
	        }
	    }
	}

	/**
	 * У FF своя атмосфера.
	 * В наших расширениях мы используем свою собственную функцию для общения между контент-скриптами
	 * @param {Object|String} message
	 * @param {String} origin
	 * @param {Boolean} forceUseOriginalPostMessage=false - показывает, что не нужно использовать нашу собственную функцию. 
	 *                      Полезно, если мы хотим общаться со страницей (например со страницей настроек или с лендингом) 
	 */
	function triggerPostMessage(message, origin) {
	    var forceUseOriginalPostMessage = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    if (window.svtPostMessage && !forceUseOriginalPostMessage) {
	        window.svtPostMessage.trigger(message);
	    } else if (window.wrappedJSObject && window.wrappedJSObject.postMessage) {
	        window.wrappedJSObject.postMessage(message, origin);
	    } else {
	        window.postMessage(message, origin);
	    }
	}

	module.exports = {
	    on: addMessageListener,
	    trigger: triggerPostMessage
	};

/***/ }

/******/ });})();