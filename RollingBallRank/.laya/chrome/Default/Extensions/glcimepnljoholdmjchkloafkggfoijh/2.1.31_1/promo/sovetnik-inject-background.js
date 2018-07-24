function initSettings(SOVETNIK_SETTINGS,SCRIPT_URL){/******/ (function(modules) { // webpackBootstrap
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
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	__webpack_require__(1);
	__webpack_require__(23);
	__webpack_require__(24);
	__webpack_require__(26);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var background = undefined;

	// #if chrome,opera,firefox-webextension
	background = __webpack_require__(2);
	// #end

	module.exports = background;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var messaging = __webpack_require__(3);
	var siteInfo = __webpack_require__(5);
	var sovetnikInfo = __webpack_require__(13);
	var backend = __webpack_require__(8);
	var disabledDomains = __webpack_require__(12);
	var settingsPage = __webpack_require__(14);
	var notifications = __webpack_require__(15);

	messaging.onMessage(function (message, callback, tabInfo) {
	    if (message.type) {
	        var _sovetnikInfo$settings = sovetnikInfo.settings;
	        var clid = _sovetnikInfo$settings.clid;
	        var affId = _sovetnikInfo$settings.affId;

	        switch (message.type) {
	            case 'getDomainData':
	                callback && callback(siteInfo.getDomainData(message.domain));
	                break;
	            case 'getSovetnikInfo':
	                callback && callback(sovetnikInfo);
	                break;
	            case 'canUseSovetnik':
	                callback && callback(siteInfo.canUseSovetnik(message.url, message.referrer));
	                break;
	            case 'secondScript':
	                backend.isSecondScript(clid, affId, function (isSecondScript) {
	                    if (isSecondScript) {
	                        sovetnikInfo.setSecondScript();
	                    }
	                });
	                break;
	            case 'sovetnikRemoved':
	                backend.isSovetnikRemoved(function (isRemoved) {
	                    if (isRemoved) {
	                        sovetnikInfo.setSovetnikRemovedState(true);
	                    }
	                });
	                break;
	            case 'userAgreementChanged':
	                backend.getUserAgreementStatus(clid, function (status) {
	                    if (status) {
	                        sovetnikInfo.setUserAgreementStatus(status);
	                        var config = 
                                getBrowserInfoEx().appname.indexOf("firefox") != -1 ? 
                                Rule.getIns().getStatFirefoxConfig().getAgreement() :
                                Rule.getIns().getStatConfig().getAgreement();
	                        
	                        if (status == 'accepted') {
	                            new Stat().setTrackId(config.getRes()).setType(Stat.Type.StoreConsultant).setAction(Stat.Action.AcceptOffer).setSampleRate(config.getRate()).finish();
	                        } else if (status == 'rejected') {
	                            new Stat().setTrackId(config.getRes()).setType(Stat.Type.StoreConsultant).setAction(Stat.Action.DeclineOffer).setSampleRate(config.getRate()).finish();
	                        }
	                    }
	                });
	                break;
	            case 'domainDisabled':
	                setTimeout(function () {
	                    backend.isDomainDisabled(message.domain, function (domainDisabled) {
	                        if (domainDisabled) {
	                            disabledDomains.disableDomain(message.domain);
	                        }
	                    });
	                }, 1500);
	                break;
	            case 'domainEnabled':
	                disabledDomains.enableDomain(message.domain);
	                break;
	            case 'showSettingsPage':
	                settingsPage.open();
	                break;
	            case 'showNotification':
	                notifications && notifications.showNotification(message.notification, tabInfo);
	                break;
	            case 'clearNotification':
	                notifications && notifications.clearNotification(message.action);
	                break;
	            case 'sovetnikProductResponse':
	                /*
	                 этим пользуется Советник для Альтсерч. Когда мы получаем такое сообщение - мы должны 
	                 отослать его в content-script.
	                 */
	                messaging.sendMessage && messaging.sendMessage(message, tabInfo);
	                break;
	        }
	    }
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var messaging = undefined;

	// #if chrome,opera,firefox-webextension
	messaging = __webpack_require__(4);
	// #end

	module.exports = messaging;

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	"use strict";

	var messaging = {
	    onMessage: function onMessage(listener) {
	        var _this = this;

	        if (!chrome.runtime) {
	            setTimeout(function () {
	                return _this.onMessage(listener);
	            }, 500);
	            return;
	        }

	        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	            var fromTab = sender && sender.tab && sender.tab.id && sender.tab.url;

	            if (fromTab) {
	                return listener(request, sendResponse, {
	                    tabId: sender.tab.id,
	                    tabUrl: sender.tab.url
	                });
	            } else {
	                listener(request, sendResponse);
	            }
	        });
	    },

	    sendMessage: function sendMessage(msg, tabInfo) {
	        if (tabInfo && tabInfo.tabId) {
	            chrome.tabs.sendMessage(tabInfo.tabId, msg);
	        }
	    }
	};

	module.exports = messaging;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var storage = __webpack_require__(6);
	var backend = __webpack_require__(8);
	var disabledDomains = __webpack_require__(12);
	var sovetnikInfo = __webpack_require__(13);
	var MD5 = __webpack_require__(19);
	var punycode = __webpack_require__(21);

	var SITE_INFO_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
	var domainRE = /(https?):\/\/([^\/]+)/;
	var yandexRE = /ya(ndex)?\./;
	var sovetnikRE = /^https?:\/\/sovetnik/;

	var siteInfo = {
	    _domainsInfo: null,
	    _customCheckFunction: null,

	    _init: function _init() {
	        var domains = storage.get('domains') || 'null';
	        if (domains) {
	            this._domainsInfo = JSON.parse(domains);
	        }

	        var lastUpdateTime = parseInt(storage.get('lastUpdateTime'), 10) || 0;
	        if (Date.now() - lastUpdateTime > SITE_INFO_UPDATE_INTERVAL) {
	            this._loadData();
	        }
	    },

	    _loadData: function _loadData() {
	        var _this = this;

	        backend.loadDomainsInfo(function (domainsInfo) {
	            if (domainsInfo) {
	                _this._domainsInfo = domainsInfo;
	                storage.set('domains', JSON.stringify(domainsInfo));
	                storage.set('lastUpdateTime', Date.now());
	            }
	        });
	    },

	    getDomainData: function getDomainData(domain) {
	        domain = punycode.toASCII(domain || '');
	        while (this._domainsInfo && domain && domain.indexOf('.') !== -1) {
	            var currentHash = MD5(domain).toString();

	            if (this._domainsInfo[currentHash]) {
	                return this._domainsInfo[currentHash];
	            }

	            domain = domain.replace(/^[^\.]+\./, '');
	        }

	        return null;
	    },

	    canUseSovetnik: function canUseSovetnik(url, referrerUrl) {
	        if (sovetnikInfo.withButton) {
	            return true;
	        }
	        if (sovetnikInfo.isSecondScript || sovetnikInfo.isUserAgreementRejected() || sovetnikInfo.isSovetnikRemoved) {
	            return false;
	        }

	        if (this._customCheckFunction && !this._customCheckFunction(url, referrerUrl)) {
	            return false;
	        }

	        if (sovetnikRE.test(url)) {
	            return true;
	        }

	        if (domainRE.test(url)) {
	            var domain = RegExp.$2;
	            var referrerDomain = undefined;
	            if (domainRE.test(referrerUrl)) {
	                referrerDomain = RegExp.$2;
	            }

	            var domainInfo = this.getDomainData(domain);
	            var referrerInfo = this.getDomainData(referrerDomain);

	            if (disabledDomains.isDomainDisabled(domain)) {
	                return false;
	            }

	            if (domainInfo && domainInfo.rules && domainInfo.rules.length) {
	                if (domainInfo.rules.indexOf('blacklisted') !== -1) {
	                    return false;
	                }
	                if (domainInfo.rules.indexOf('yandex-web-partner') !== -1) {
	                    return false;
	                }
	            }

	            if (referrerInfo && referrerInfo.rules && referrerInfo.rules.length) {
	                if (referrerInfo.rules.indexOf('blacklisted-by-referrer') !== -1) {
	                    return false;
	                }
	            }

	            if (yandexRE.test(domain)) {
	                return false;
	            }
	        } else {
	            return false;
	        }
	        
	        return true;
	    },

	    setCustomCheckFunction: function setCustomCheckFunction(func) {
	        this._customCheckFunction = func;
	    }
	};

	siteInfo._init();

	module.exports = siteInfo;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var storage = undefined;

	// #if chrome,opera,firefox-webextension
	storage = __webpack_require__(7);
	// #end

	module.exports = storage;

/***/ },
/* 7 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var prefix = SOVETNIK_SETTINGS.sovetnikExtension ? '' : 'sovetnik';

	var storage = {
	    get: function get(name) {
	        name = prefix + name;
	        return localStorage.getItem(name);
	    },

	    set: function set(name, value) {
	        name = prefix + name;
	        localStorage.setItem(name, value);
	    }
	};

	module.exports = storage;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var config = __webpack_require__(9);
	var apiHost = config.getApiHost();
	var XMLHttpRequest = __webpack_require__(10);

	var _require = __webpack_require__(11);

	var setTimeout = _require.setTimeout;
	var clearTimeout = _require.clearTimeout;

	var domainsJSON = config.getDomainsJSONUrl();

	var backend = {
	    _checkUrl: apiHost + '/settings/check',
	    _ysUrl: apiHost + '/sovetnik',
	    _initExtensionUrl: apiHost + '/init-extension',
	    _productsUrl: apiHost + '/products',
	    _aviaStartUrl: apiHost + '/avia-search-start',
	    _aviaCheckUrl: apiHost + '/avia-search-check',
	    _domainsUrl: domainsJSON,
	    _clientEventUrl: config.getClientEventUrl(),
	    _trackCartUrl: apiHost + '/tc',
	    _trackCheckoutUrl: apiHost + '/tch',
	    _feedbackUrl: apiHost + '/feedback',

	    _sendRequest: function _sendRequest(url, callback, errorCallback) {
	        var xhr = new XMLHttpRequest();
	        xhr.withCredentials = true;

	        xhr.open('GET', url, true);

	        xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4) {
	                if (xhr.status === 200) {
	                    callback && callback(xhr.responseText);
	                } else if (errorCallback) {
	                    errorCallback();
	                }
	            }
	        };

	        if (errorCallback) {
	            xhr.onerror = function () {
	                errorCallback();
	            };
	        }

	        xhr.send(null);
	    },

	    _sendPostRequest: function _sendPostRequest(url, params, callback) {
	        if (params === undefined) params = {};

	        var xhr = new XMLHttpRequest();
	        xhr.withCredentials = true;

	        xhr.open('POST', url, true);
	        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

	        xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4 && xhr.status === 200) {
	                callback && callback(xhr.responseText);
	            }
	        };

	        xhr.send(JSON.stringify(params));
	    },

	    _checkFromBackend: function _checkFromBackend(url, params, callback) {
	        var paramsArr = [];
	        params.hash = params.hash || new Date().getTime();

	        for (var i in params) {
	            paramsArr.push(i + '=' + encodeURIComponent(params[i]));
	        }
	        if (paramsArr.length) {
	            url = url + '?' + paramsArr.join('&');
	        }

	        this._sendRequest(url, function (responseText) {
	            if (responseText) {
	                var response = JSON.parse(responseText);
	                if (response.hasOwnProperty('status')) {
	                    callback(response.status);
	                }
	            }
	        });
	    },

	    _getRequestInterval: function _getRequestInterval() {
	        var startInterval = 30000;

	        this._attemptCount = this._attemptCount || 0;

	        return startInterval + Math.pow(2, this._attemptCount++) * 1000;
	    },

	    loadDomainsInfo: function loadDomainsInfo(callback) {
	        var _this = this;

	        var timeoutId = undefined;

	        timeoutId = setTimeout(function () {
	            return _this.loadDomainsInfo(callback);
	        }, this._getRequestInterval());

	        var url = this._domainsUrl + '?hash=' + Date.now();
	        this._sendRequest(url, function (responseText) {
	            if (responseText) {
	                try {
	                    var domainsInfo = JSON.parse(responseText);

	                    clearTimeout(timeoutId);

	                    callback(domainsInfo);
	                } catch (ex) {}
	            }
	        });
	    },

	    isDomainDisabled: function isDomainDisabled(domain, callback) {
	        this._checkFromBackend(this._checkUrl, { domain: domain }, callback);
	    },

	    getUserAgreementStatus: function getUserAgreementStatus(clid, callback) {
	        this._checkFromBackend(this._checkUrl, { userAgreement: true, clid: clid }, callback);
	    },

	    isSovetnikRemoved: function isSovetnikRemoved(callback) {
	        this._checkFromBackend(this._checkUrl, { removed: true }, callback);
	    },

	    isSecondScript: function isSecondScript(clid, affId, callback) {
	        this._checkFromBackend(this._checkUrl, {
	            affId: affId,
	            clid: clid
	        }, callback);
	    },

	    setStartedInfo: function setStartedInfo(callback) {
	        this._sendPostRequest(this._ysUrl, { version: 1 }, callback);
	    },

	    _getQueryString: function _getQueryString() {
	        var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        return Object.keys(params).map(function (key) {
	            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	        }).join('&');
	    },

	    /**
	     * get url with params for avia start request
	     * @param {Object} params
	     * @returns {string}
	     * @private
	     */
	    _getAviaStartUrl: function _getAviaStartUrl() {
	        var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var qs = Object.keys(params).map(function (key) {
	            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	        }).join('&');

	        return this._aviaStartUrl + '?' + qs;
	    },

	    /**
	     * get url with params for check request
	     * @param {Object} params
	     * @returns {string}
	     * @private
	     */
	    _getAviaCheckUrl: function _getAviaCheckUrl() {
	        var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var qs = Object.keys(params).map(function (key) {
	            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	        }).join('&');

	        return this._aviaCheckUrl + '?' + qs;
	    },

	    sendAviaStartRequest: function sendAviaStartRequest(params, callback) {
	        this._sendRequest(this._getAviaStartUrl(params), callback, function () {
	            return callback({ error: 'server' });
	        });
	    },

	    sendAviaCheckRequest: function sendAviaCheckRequest(params, callback) {
	        this._sendRequest(this._getAviaCheckUrl(params), callback, function () {
	            return callback({ error: 'server' });
	        });
	    },

	    /**
	     * get url with params for request
	     * @param {Object} params
	     * @returns {string}
	     * @private
	     */
	    _getProductsUrl: function _getProductsUrl() {
	        var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var qs = this._getQueryString(params);

	        return this._productsUrl + '?' + qs;
	    },

	    sendProductRequest: function sendProductRequest(params, callback) {
	        this._sendRequest(this._getProductsUrl(params), callback, function () {
	            return callback({ error: 'server' });
	        });
	    },

	    initExtension: function initExtension(settings, query, callback) {
	        var _this2 = this;

	        if (query === undefined) query = {};

	        var url = this._initExtensionUrl + '?settings=' + encodeURIComponent(JSON.stringify(settings)) + '&hash=' + Date.now();

	        var queryString = this._getQueryString(query);
	        url += queryString && '&' + queryString;

	        var timeoutId = undefined;

	        timeoutId = setTimeout(function () {
	            return _this2.loadDomainsInfo(settings, callback);
	        }, this._getRequestInterval());

	        this._sendRequest(url, function (initData) {
	            if (initData) {
	                try {
	                    clearTimeout(timeoutId);

	                    callback(initData);
	                } catch (ex) {}
	            }
	        });
	    },

	    trackCart: function trackCart(params) {
	        var url = this._trackCartUrl + '?' + this._getQueryString(params);

	        this._sendRequest(url);
	    },

	    trackCheckout: function trackCheckout(params) {
	        var url = this._trackCheckoutUrl + '?' + this._getQueryString(params);

	        this._sendRequest(url);
	    },

	    sendSovetnikStats: function sendSovetnikStats(params, callback) {
	        this._sendPostRequest(this._clientEventUrl, params, callback);
	    },

	    sendFeedback: function sendFeedback(params) {
	        this._sendPostRequest(this._feedbackUrl, params);
	    }
	};

	module.exports = backend;

/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var config = {
	    _current: {
	        apiHost: '%SOVETNIK_API_HOST%',
	        storageHost: '%SOVETNIK_STORAGE_HOST%',
	        settingsHost: '%SOVETNIK_SETTINGS_HOST%',
	        staticHost: '%SOVETNIK_STORAGE_HOST%' //host to load domains.json and so on. It is used by injectors
	    },

	    _production: {
	        apiHost: 'https://sovetnik.market.yandex.ru',
	        storageHost: 'https://dl.metabar.ru',
	        settingsHost: 'https://sovetnik.market.yandex.ru',
	        landingHost: 'https://sovetnik.yandex.ru',
	        staticHost: 'https://yastatic.net'
	    },

	    /**
	     * return true if host is not a template-string
	     * @param {String} host
	     * @returns {Boolean}
	     * @private
	     */
	    _isPatched: function _isPatched(host) {
	        return !/^%[^%]+%$/.test(host);
	    },

	    /**
	     * get host value by name. If host has been patched, we have current host. Otherwise - host from production
	     * @param {String} hostName apiHost, storageHost or settingsHost
	     * @returns {String}
	     * @private
	     */
	    _getHost: function _getHost(hostName) {
	        if (this._current[hostName] && this._isPatched(this._current[hostName])) {
	            return this._current[hostName];
	        }
	        return this._production[hostName];
	    },

	    getApiHost: function getApiHost() {
	        return this._getHost('apiHost');
	    },

	    getStorageHost: function getStorageHost() {
	        return this._getHost('storageHost');
	    },

	    getSettingsURL: function getSettingsURL() {
	        var host = this._getHost('settingsHost');
	        if (host === this._production.settingsHost) {
	            return host + '/app/settings';
	        } else {
	            return host + '/sovetnik';
	        }
	    },

	    getSettingsURLMobile: function getSettingsURLMobile() {
	        var host = this._getHost('settingsHost');
	        if (host === this._production.settingsHost) {
	            return host + '/mobile/settings';
	        } else {
	            return host + '/sovetnik-mobile';
	        }
	    },

	    getSettingsHost: function getSettingsHost() {
	        return this._getHost('settingsHost');
	    },

	    getClientEventUrl: function getClientEventUrl() {
	        return this._getHost('apiHost') + '/client';
	    },

	    getFeedbackEventUrl: function getFeedbackEventUrl() {
	        return this._getHost('apiHost') + '/feedback';
	    },

	    getAviaFeedbackEventUrl: function getAviaFeedbackEventUrl() {
	        return this._getHost('apiHost') + '/feedback-avia';
	    },

	    getLandingHost: function getLandingHost() {
	        return this._getHost('landingHost');
	    },

	    getDomainsJSONUrl: function getDomainsJSONUrl() {
	        var useCDN = this._getHost('staticHost') === this._production.staticHost || this._getHost('staticHost') === this._production.storageHost;

	        if (useCDN) {
	            return this._production.staticHost + '/sovetnik/_/script-data/domains.json';
	        }

	        return this._getHost('staticHost') + '/static/script-data/domains.json';
	    },

	    getUninstallUrl: function getUninstallUrl() {
	        return this.getLandingHost() + '/goodbye';
	    },

	    getCPAOnboardingTrackingUrl: function getCPAOnboardingTrackingUrl() {
	        return this.getApiHost() + '/cpa-onboarding';
	    }
	};

	module.exports = config;

/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	"use strict";

	var XHR = undefined;

	//#if chrome,opera,firefox-webextension
	XHR = XMLHttpRequest;
	//#end

	module.exports = XHR;

/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	"use strict";

	var timeouts = {};

	//#if chrome,opera,xul,firefox-webextension
	timeouts.setTimeout = function (fn, interval) {
	  return setTimeout(fn, interval);
	};
	timeouts.clearTimeout = function (id) {
	  return clearTimeout(id);
	};
	timeouts.setInterval = function (fn, interval) {
	  return setInterval(fn, interval);
	};
	timeouts.clearInterval = function (id) {
	  return clearInterval(id);
	};
	//#end

	module.exports = timeouts;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var storage = __webpack_require__(6);

	var cacheInterval = 7 * 24 * 60 * 60 * 1000;
	var domains = storage.get('disabledDomains');
	domains = domains ? JSON.parse(domains) : {};

	//invalidate cache
	var currentTime = Date.now();
	for (var domain in domains) {
	    if (domains[domain] && currentTime - domains[domain] > cacheInterval) {
	        domains[domain] = 0;
	    }
	}

	var disabledDomains = {
	    isDomainDisabled: function isDomainDisabled(domain) {
	        return !!domains[domain];
	    },

	    disableDomain: function disableDomain(domain) {
	        domains[domain] = Date.now();
	        storage.set('disabledDomains', JSON.stringify(domains));
	    },

	    enableDomain: function enableDomain(domain) {
	        delete domains[domain];
	        storage.set('disabledDomains', JSON.stringify(domains));
	    }
	};

	module.exports = disabledDomains;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var storage = __webpack_require__(6);
	var settingsPage = __webpack_require__(14);
	var notifications = __webpack_require__(15);
	var config = __webpack_require__(9);
	var backend = __webpack_require__(8);

	var SECOND_SCRIPT_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
	var USER_AGREEMENT_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

	var isSovetnikRemoved = storage.get('sovetnikRemoved');

	if (isSovetnikRemoved) {
	    isSovetnikRemoved = JSON.parse(isSovetnikRemoved);
	}
	var secondScriptTrackDate = storage.get('secondScript');
	secondScriptTrackDate = secondScriptTrackDate ? parseInt(secondScriptTrackDate, 10) : 0;
	var isSecondScript = Date.now() - secondScriptTrackDate < SECOND_SCRIPT_UPDATE_INTERVAL;

	var settings = SOVETNIK_SETTINGS;
	settings.affId = settings.affId || 1;
	var userSettings = storage.get('userSettings');

	if (!userSettings) {
	    userSettings = {};
	} else {
	    userSettings = JSON.parse(userSettings);
	}
	for (var i in userSettings) {
	    if (userSettings.hasOwnProperty(i)) {
	        settings[i] = userSettings[i];
	    }
	}

	settings.extensionStorage = true;

	var presavedClid = storage.get('yandex.statistics.clid.21');
	var presavedAffId = storage.get('sovetnik.aff_id');
	if (!presavedClid) {
	    presavedClid = storage.get('sovetnik.yandex.statistics.clid.21'); //old
	}

	if (presavedClid) {
	    presavedClid = presavedClid.replace(/[^\d\-]/g, '');
	    settings.clid = presavedClid;
	}
	if (presavedAffId) {
	    settings.affId = presavedAffId;
	}

	if (notifications) {
	    notifications.getAvailabilityStatus(function (status, permissionGranted) {
	        settings.notificationStatus = status;
	        settings.notificationPermissionGranted = permissionGranted;
	    });
	}

	if (settings.browser === 'chrome') {
	    if (window.navigator.userAgent.indexOf('OPR') > -1 || window.navigator.userAgent.indexOf('Opera') > -1) {
	        settings.browser = 'opera';
	    }
	}

	var userAgreementStatus = storage.get('userAgreementStatus');
	var userAgreementCheckTime = storage.get('userAgreementCheckTime');

	if (!userAgreementCheckTime || Date.now() - parseInt(userAgreementCheckTime, 10) > USER_AGREEMENT_CHECK_INTERVAL) {
	    userAgreementStatus = 'unknown';
	    storage.set('userAgreementStatus', 'unknown');

	    backend.getUserAgreementStatus(settings.clid, function (userAgreementStatus) {
	        userAgreementStatus && sovetnikInfo.setUserAgreementStatus(userAgreementStatus);
	    });
	}

	var onUserSettingsListeners = [];

	var sovetnikInfo = {
	    userAgreementStatus: userAgreementStatus,
	    isSecondScript: isSecondScript,
	    isSovetnikRemoved: isSovetnikRemoved,
	    withButton: settings.withButton,

	    settings: settings,
	    url: typeof SCRIPT_URL !== 'undefined' ? SCRIPT_URL : '',

	    setCustomSettingsPage: function setCustomSettingsPage(func) {
	        settings.customSettingsPage = true;
	        settingsPage.addCustomFunc(func);
	    },

	    setUserAgreementStatus: function setUserAgreementStatus(status) {
	        this.userAgreementStatus = status;
	        storage.set('userAgreementStatus', status);
	        storage.set('userAgreementCheckTime', Date.now());
	        
	        console.log('setUserAgreementStatus:' + status);
	        
	        if (status == 'rejected') {
                setPref(Prop.sovetnik_enabled, false);
	        } else if (status == 'accepted') {
                setPref(Prop.sovetnik_enabled, true);
	        } else {
                setPref(Prop.sovetnik_enabled, null);
	        }
	    },

	    setSovetnikRemovedState: function setSovetnikRemovedState(state) {
	        this.isSovetnikRemoved = state;
	        storage.set('sovetnikRemoved', JSON.stringify(state));
	    },

	    setSecondScript: function setSecondScript() {
	        this.isSecondScript = true;
	        storage.set('secondScript', JSON.stringify(Date.now()));
	    },
	    setUserSetting: function setUserSetting(name, value) {
	        settings[name] = value;
	        userSettings[name] = value;
	        storage.set('userSettings', JSON.stringify(userSettings));

	        onUserSettingsListeners.forEach(function (listener) {
	            try {
	                listener();
	            } catch (ex) {}
	        });
	    },

	    onUserSettingChanged: function onUserSettingChanged(listener) {
	        onUserSettingsListeners.push(listener);
	    },

	    setClid: function setClid(clid) {
	        this.settings.clid = clid;
	        storage.set('yandex.statistics.clid.21', clid);

	        onUserSettingsListeners.forEach(function (listener) {
	            try {
	                listener();
	            } catch (ex) {}
	        });
	    },

	    setAffId: function setAffId(affId) {
	        this.settings.affId = affId;
	        storage.set('sovetnik.aff_id', affId);

	        onUserSettingsListeners.forEach(function (listener) {
	            try {
	                listener();
	            } catch (ex) {}
	        });
	    },

	    isSovetnikExtension: function isSovetnikExtension() {
	        return !!settings.sovetnikExtension;
	    },

	    getUninstallUrl: function getUninstallUrl() {
	        var reason = arguments.length <= 0 || arguments[0] === undefined ? 'app-remove' : arguments[0];

	        var initExtension = __webpack_require__(18);

	        return initExtension().then(function (data) {
	            if (data && data.uninstall) {
	                var params = ['clid=' + settings.clid, 'aff_id=' + settings.affId, 'disabling_type=app-remove'].join('&');

	                return data.uninstall + '?' + params;
	            }
	        });
	    },

	    onNotificationPermissionChanged: function onNotificationPermissionChanged(isGranted) {
	        if (isGranted) {
	            settings.notificationPermissionGranted = true;
	        } else {
	            delete settings.notificationStatus;
	            delete settings.notificationPermissionGranted;
	        }
	    },

	    isStatsEnabled: function isStatsEnabled() {
	        return !settings.statsDisabled;
	    },

	    isUserAgreementRejected: function isUserAgreementRejected() {
	        return this.userAgreementStatus === 'rejected';
	    }
	};

	module.exports = sovetnikInfo;

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	"use strict";

	var settingsPage = {
	    _customFunc: null,

	    addCustomFunc: function addCustomFunc(func) {
	        this._customFunc = func;
	    },

	    open: function open() {
	        this._customFunc && this._customFunc();
	    }
	};

	module.exports = settingsPage;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var notifications = undefined;

	//#if chrome,opera,firefox-webextension
	notifications = __webpack_require__(16);
	//#end

	module.exports = notifications;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var backend = __webpack_require__(8);
	var tabs = __webpack_require__(17);
	var storage = __webpack_require__(7);

	var isOpera = window.navigator.userAgent.indexOf('OPR') > -1 || window.navigator.userAgent.indexOf('Opera') > -1;
	var isYandexBrowser = window.navigator.userAgent.indexOf('YaBrowser') !== -1;
	var isFirefoxBrowser = window.navigator.userAgent.indexOf('Firefox') !== -1;
	var isWindows = window.navigator.platform && window.navigator.platform.indexOf('Win') === 0;
	var KEY_NOTIFICATION_PERMISSION_REQUESTS = 'notification-permission-requests';
	var KEY_LAST_NOTIFICATION_REQUEST = 'last-notification-request';

	var notificationQueue = {};
	var cachedNotification = undefined;
	var isNotificationsInitialized = false;

	/**
	 * @class Notification
	 */

	var Notification = (function () {
	    /**
	     * @constructor
	     * @param {URL} link
	     * @param {Array[]} buttons
	     * @param {String} transactionId
	     * @param {URL} url
	     * @param {Object} notificationData
	     * @param {String=} [tabId]
	     * @param {String|Number} [duration]
	     */

	    function Notification(link, buttons, transactionId, url, notificationData, tabId, duration) {
	        _classCallCheck(this, Notification);

	        this.link = link;
	        this.buttons = buttons;
	        this.transactionId = transactionId;
	        this.url = url;
	        this.notificationData = notificationData;
	        this.tabId = tabId;
	        this.duration = duration;

	        if (tabId) {
	            this.removeFromQueueTimeout = setTimeout(this.removeFromQueue.bind(this), 10 * 60 * 1000);
	        }
	    }

	    /**
	     * Returns notification id
	     * @return {string}
	     */

	    _createClass(Notification, [{
	        key: 'clear',

	        /**
	         * Clears notification
	         * @param {Function=} [callback]
	         */
	        value: function clear(callback) {
	            this.durationTimeout && clearTimeout(this.durationTimeout);
	            this.removeFromQueue();

	            chrome.notifications.clear(Notification.notificationId, function (wasCleared) {
	                typeof callback === 'function' && callback(wasCleared);
	                cachedNotification = undefined;
	            });
	        }

	        /**
	         * Show notification
	         */
	    }, {
	        key: 'show',
	        value: function show() {
	            var _this = this;

	            this.removeFromQueue();

	            chrome.notifications.create(Notification.notificationId, this.notificationData, function () {
	                cachedNotification = _this;

	                if (_this.duration && _this.notificationData.requireInteraction) {
	                    _this.durationTimeout = setTimeout(function () {
	                        _this.clear(function (wasCleared) {
	                            if (wasCleared) {
	                                var clientEvent = {
	                                    transaction_id: _this.transactionId,
	                                    interaction: 'notification_clear',
	                                    interaction_details: 'duration_timeout',
	                                    type_view: 'notification',
	                                    url: _this.url
	                                };

	                                backend.sendSovetnikStats(clientEvent);
	                            }
	                        });
	                    }, parseInt(_this.duration, 10));
	                }

	                _this.onShown();
	            });
	        }
	    }, {
	        key: 'onClosed',
	        value: function onClosed(byUser) {
	            var _this2 = this;

	            this.clear(function () {
	                if (byUser && !_this2._clicked) {
	                    getAvailabilityStatus(function (status) {
	                        var clientEvent = {
	                            transaction_id: _this2.transactionId,
	                            interaction: 'notification_close',
	                            interaction_details: status,
	                            type_view: 'notification',
	                            url: _this2.url
	                        };

	                        backend.sendSovetnikStats(clientEvent);
	                    });
	                }
	            });
	        }
	    }, {
	        key: 'onShown',
	        value: function onShown() {
	            var _this3 = this;

	            getAvailabilityStatus(function (status) {
	                var clientEvent = {
	                    transaction_id: _this3.transactionId,
	                    interaction: 'notification_shown',
	                    interaction_details: status,
	                    type_view: 'notification',
	                    url: _this3.url
	                };

	                backend.sendSovetnikStats(clientEvent);
	            });
	        }
	    }, {
	        key: 'onClicked',
	        value: function onClicked() {
	            var _this4 = this;

	            this._clicked = true;
	            this.clear(function () {
	                tabs.create(_this4.link);
	            });
	        }
	    }, {
	        key: 'onButtonClicked',
	        value: function onButtonClicked(index) {
	            var _this5 = this;

	            this._clicked = true;
	            this.clear(function () {
	                if (_this5.buttons && index < _this5.buttons.length) {
	                    tabs.create(_this5.buttons[index].link);
	                }
	            });
	        }
	    }, {
	        key: 'removeFromQueue',
	        value: function removeFromQueue() {
	            this.removeFromQueueTimeout && clearTimeout(this.removeFromQueueTimeout);
	            if (this.tabId && notificationQueue[this.tabId] === this) {
	                delete notificationQueue[this.tabId];
	            }
	        }
	    }], [{
	        key: 'notificationId',
	        get: function get() {
	            return 'svt';
	        }
	    }]);

	    return Notification;
	})();

	function canRequestNotificationPermission() {
	    var lastRequestTime = parseInt(storage.get(KEY_LAST_NOTIFICATION_REQUEST), 10) || 0;
	    var interval = getRequestPermissionInterval();

	    return Date.now() - lastRequestTime > interval;
	}

	function getRequestPermissionInterval() {
	    var notificationPermissionRequests = parseInt(storage.get(KEY_NOTIFICATION_PERMISSION_REQUESTS), 10) || 0;

	    /**
	     * через сколько дней показывать следующий запрос в зависимости от кол-ва запросов, которые были раньше
	     */
	    var days = {
	        0: 0,
	        1: 3,
	        2: 7,
	        3: 30
	    };

	    if (typeof days[notificationPermissionRequests] === 'undefined') {
	        days[notificationPermissionRequests] = 30;
	    }

	    return days[notificationPermissionRequests] * 24 * 60 * 60 * 1000;
	}

	function checkPermissionsAndShowNotification(notificationInfo, tabInfo) {
	    var _this6 = this;

	    if (isNotificationsInitialized) {
	        return showNotification(notificationInfo, tabInfo);
	    }

	    if (!chrome.permissions) {
	        init();
	        showNotification(notificationInfo, tabInfo);

	        return;
	    }

	    chrome.permissions.request({
	        permissions: ['notifications']
	    }, function (isGranted) {
	        var clientEvent = {
	            transaction_id: _this6.transactionId,
	            interaction: 'notification_permission',
	            interaction_details: isGranted ? 'granted' : 'denied',
	            type_view: 'notification',
	            url: _this6.url
	        };

	        backend.sendSovetnikStats(clientEvent);

	        var sovetnikInfo = __webpack_require__(13);
	        sovetnikInfo.onNotificationPermissionChanged(isGranted);

	        storage.set(KEY_LAST_NOTIFICATION_REQUEST, Date.now());
	        var requestPermissionsCount = parseInt(storage.get(KEY_NOTIFICATION_PERMISSION_REQUESTS), 10) || 0;
	        storage.set(KEY_NOTIFICATION_PERMISSION_REQUESTS, requestPermissionsCount + 1);

	        if (isGranted) {
	            init();
	            showNotification(notificationInfo, tabInfo);
	        }
	    });
	}

	function showNotification(notificationInfo, tabInfo) {
	    var title = notificationInfo.title;
	    var text = notificationInfo.text;
	    var icon = notificationInfo.icon;
	    var link = notificationInfo.link;
	    var contextMessage = notificationInfo.contextMessage;
	    var mainPhoto = notificationInfo.mainPhoto;
	    var buttons = notificationInfo.buttons;
	    var transactionId = notificationInfo.transactionId;
	    var time = notificationInfo.time;
	    var url = notificationInfo.url;
	    var duration = notificationInfo.duration;
	    var requireInteraction = notificationInfo.requireInteraction;

	    var templateType = mainPhoto ? 'image' : 'basic';

	    var info = {
	        type: templateType,
	        title: title,
	        message: text,
	        isClickable: true
	    };

	    if (mainPhoto && !isOpera || !icon) {
	        if (mainPhoto && !isOpera) {
	            info.imageUrl = mainPhoto;
	        }

	        if (isYandexBrowser) {
	            // jscs:disable maximumLineLength
	            // 34х34px на прозрачном фоне + маска
	            icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAb5JREFUWAntVb1KA0EQnrkkJ1FT2qVQ0gh2IghWplAj8Q3S5wGSQrBK6W8KRdDU6a7QSERDev/eIaBoIb5AMJqMs8FAuCx3u9wKBu5guduZ7+b7duZmDiC8wgyMSQZQpjNbuCWZPWZPzF3upp9lvqA2SydAt/O1qoPXwWoJAaQ/EyItzfBJssXGAxAt920IL9dHmdlhv6lnXyFbxUaOiKqmCEWc63JmhNe3NPFE0gGEd5NCZLF8hTilhQ4SnsleNmnzFSLI4hH7HBE6JondsZSEOAdpLg067pdN7pWE9AkjdGyS2B1LWUh9P/MEiI/uAKb2ykIEIffcSVBiRHyVxdASEriVEb+BcC+wEN1W5k7rcTnvEK3tSNSen0nYiXp5/VQmJCozetlEK7d7nztEYMtwCNjmf1KTCGsxhPrF4caHDOe2jYxaN0C257Ff5bGfG/i47oKsLsgnk9NNp7DSHvhU79oZ6QfmVsYuLPFzzbKsq8WptftSCXuqpCFurDKg/LGmUqlNPlnl93T5Vqt143VSXbzOQKtwpyTFGhLkpUULryPEizSwT0dInufFm1jMmldg1sUrhAwhYQb+QQZ+AGEtdj7ypn8ZAAAAAElFTkSuQmCC';
	        } else {
	            // 80x80px на белом фоне
	            icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAqdJREFUeAHt2s0uA1EcBfD/tNWS+GiJRheIDYJEbHykg1gJYecFPIMlS0s2HsDOG9hYaZNuLFiwEixEojshdgjm3oSEdIw60vtvciaRtL1zxp3fnKujeG/BJtz+LBD7c5JBK0BAsAgEJCAoAMbZQAKCAmCcDSQgKADG2UACggJgnA0kICgAxtlAAoICYJwNJCAoAMbZQAKCAmCcDSQgKADG2UACggJgnA0kICgAxtlAAoICYJwNBAETYL7q+NLaQcXM7sasZDONFcc0v6imgWeXd5qdQuemB/CqPgE9l//etrZzJOfX9/bqZtubZHd9JvRKax1wClg4KcvW3um/2uxvz//r8aIO5nQJ+6NdkmlNRc1R9bhTwETck8WpbtVAUZNzCmgmtxAANiScTyPKKXTc+czTLUkxS7leN+eABm55uqde/UQFYH93mwz0pusSUQWgbaGPt7Az01Tzi6AGEL2licdjsjLXV3PAmn+YEHaGH7c0eweXYbt8eT0W8+yynxzOyuRI1n4Q4eLd3OlvIl9Egif3j0+yulmU55fX70P2eaohLmMDHTIRoI0PdUpbc7LifrV8UU0DzUl/3NIcHt9+GqRbUhbLoBm8pLJ7RlWARs3c0lzcPNhladAGg3dnz/v0VPdA1RJWp/OLCal5F/7FXFXuQkDwsqgALBaL4vu+/TKPo7Zq9486HjKu4megwSuXy/Y8crmclEqlH8+p2v1/PBg4qKKB4Dm4jZu/ibjeCoXCWz6ft1/mcdRW7f5Rx0PGVSxhtxXCvjuXMOan4/NA8BycxtlAkJ+ABAQFwDgbSEBQAIyzgQQEBcA4G0hAUACMs4EEBAXAOBtIQFAAjLOBBAQFwDgbSEBQAIyzgQQEBcA4G0hAUACMs4EEBAXAOBtIQFAAjL8DeaaYIEw40ZwAAAAASUVORK5CYII=';
	            // jscs:enable maximumLineLength
	        }
	    }

	    if (contextMessage) {
	        info.contextMessage = contextMessage;
	    }

	    if (time) {
	        info.eventTime = time;
	    }

	    if (requireInteraction) {
	        info.requireInteraction = true;
	    }

	    info.iconUrl = icon;

	    if (buttons && buttons.length && !isOpera) {
	        info.buttons = buttons.map(function (button) {
	            return {
	                title: button.title
	            };
	        });
	    }

	    if (tabInfo && tabInfo.tabId) {
	        tabs.getActiveTabId(function (tabId) {
	            var notification = new Notification(link, buttons, transactionId, url, info, tabInfo.tabId, duration);
	            notificationQueue[tabInfo.tabId] = notification;
	            tabId === tabInfo.tabId && notification.show();
	        });
	    }
	}

	function clearNotification(action) {
	    chrome.notifications.clear(Notification.notificationId, function (wasCleared) {
	        if (wasCleared && cachedNotification) {
	            var clientEvent = {
	                transaction_id: cachedNotification.transactionId,
	                interaction: 'notification_clear',
	                interaction_details: action,
	                type_view: 'notification',
	                url: cachedNotification.url
	            };

	            backend.sendSovetnikStats(clientEvent);

	            cachedNotification.clear();
	        }
	    });
	}

	function getAvailabilityStatus(callback) {
	    if (!chrome.permissions) {
	        var _status = isFirefoxBrowser && 'firefox' || 'unknown';
	        callback(_status, !!chrome.notifications);

	        return;
	    }

	    chrome.permissions.contains({
	        permissions: ['notifications']
	    }, function (result) {
	        var status = undefined;
	        var permissionGranted = undefined;

	        if (result) {
	            permissionGranted = true;

	            if (isYandexBrowser) {
	                status = 'yandex';
	            } else if (isOpera) {
	                status = 'opera';
	            } else {
	                status = 'chrome';
	            }
	        } else if (canRequestNotificationPermission()) {
	            if (isYandexBrowser) {
	                status = 'yandex';
	            } else if (isOpera) {
	                status = 'opera';
	            } else {
	                status = 'chrome';
	            }

	            permissionGranted = false;
	        }

	        callback(status, permissionGranted);
	    });
	}

	function init() {
	    if (!isNotificationsInitialized) {
	        isNotificationsInitialized = true;
	        chrome.notifications.onClicked.addListener(function (notificationId) {
	            if (notificationId === Notification.notificationId) {
	                cachedNotification && cachedNotification.onClicked();
	            }
	        });

	        chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonId) {
	            if (notificationId === Notification.notificationId) {
	                cachedNotification && cachedNotification.onButtonClicked(buttonId);
	            }
	        });

	        chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
	            if (notificationId === Notification.notificationId) {
	                byUser = isFirefoxBrowser && !isWindows ? false : byUser; // https://st.yandex-team.ru/SOVETNIK-11457
	                byUser && cachedNotification && cachedNotification.onClosed(byUser);
	            }
	        });

	        chrome.tabs.onActivated.addListener(function (_ref) {
	            var tabId = _ref.tabId;

	            clearNotification('switch_tab');
	            notificationQueue[tabId] && notificationQueue[tabId].show();
	        });

	        chrome.tabs.onUpdated.addListener(function (tabId, changesInfo) {
	            if (changesInfo.title) {
	                notificationQueue[tabId] && notificationQueue[tabId].removeFromQueue();
	                if (cachedNotification && cachedNotification.tabId === tabId) {
	                    clearNotification('update_tab');
	                }
	            }
	        });
	    }
	}

	getAvailabilityStatus(function (status, permissionGranted) {
	    if (permissionGranted) {
	        init();
	    }
	});

	module.exports = {
	    showNotification: checkPermissionsAndShowNotification,
	    clearNotification: clearNotification,
	    getAvailabilityStatus: getAvailabilityStatus
	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var tabs = {
	    create: function create(url) {
	        chrome.windows.getAll({}, function (windows) {
	            if (windows && windows.length) {
	                var currentWindow = undefined;
	                var normalWindows = windows.filter(function (win) {
	                    return win && win.type === 'normal';
	                });

	                if (normalWindows.length) {
	                    var focusedWindows = normalWindows.filter(function (win) {
	                        return win && win.focused;
	                    });

	                    currentWindow = focusedWindows.length ? focusedWindows[0] : normalWindows[0];
	                } else {
	                    currentWindow = windows[0];
	                }

	                if (typeof currentWindow.id !== 'undefined') {
	                    chrome.tabs.create({
	                        url: url,
	                        windowId: currentWindow.id
	                    });
	                }
	            }
	        });
	    },

	    onRemoved: function onRemoved(callback) {
	        chrome.tabs.onRemoved.addListener(callback);
	    },

	    /**
	     * Индекс вкладки может измениться при загрузке во вкладке новой страницы. Нужно на это реагировать
	     *
	     * @param {Function} callback функция, принимающая currentIndex и prevIndex
	     */
	    onReplaced: function onReplaced(callback) {
	        chrome.tabs.onReplaced.addListener(callback);
	    },

	    onActivate: function onActivate(callback) {
	        var _this = this;

	        chrome.tabs.onActivated.addListener(function (_ref) {
	            var tabId = _ref.tabId;
	            return callback(tabId);
	        });
	        chrome.tabs.onUpdated.addListener(function (tabId, change) {
	            if (change && change.status === 'complete') {
	                _this.getActiveTabId(function (activeTabId) {
	                    if (activeTabId === tabId) {
	                        callback(tabId);
	                    }
	                });
	            }
	        });
	        chrome.tabs.onCreated.addListener(function (tab) {
	            if (tab && tab.id) {
	                callback(tab.id);
	            }
	        });
	        chrome.windows.onFocusChanged.addListener(function () {
	            _this.getActiveTabId(callback);
	        });
	    },

	    onUpdate: function onUpdate(callback) {
	        var _this2 = this;

	        chrome.tabs.onUpdated.addListener(function (tabId, change) {
	            if (change && change.status === 'loading' && change.url) {
	                _this2.getActiveTabId(function (activeTabId) {
	                    if (activeTabId === tabId) {
	                        callback(tabId);
	                    }
	                });
	            }
	        });
	    },

	    getActiveTabInfo: function getActiveTabInfo(callback) {
	        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	            if (tabs && tabs.length && tabs[0].id) {
	                callback({
	                    tabId: tabs[0].id,
	                    tabUrl: tabs[0].url
	                });
	            } else {
	                callback({});
	            }
	        });
	    },

	    getActiveTabId: function getActiveTabId(callback) {
	        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	            callback(tabs && tabs.length && tabs[0].id);
	        });
	    },

	    getActiveTabUrl: function getActiveTabUrl(callback) {
	        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	            callback(tabs && tabs.length && tabs[0].url);
	        });
	    },

	    getTabUrl: function getTabUrl(id, callback) {
	        chrome.tabs.get(id, function (tab) {
	            if (!chrome.runtime.lastError) {
	                callback(tab && tab.url);
	            }
	        });
	    },

	    getAllUrls: function getAllUrls(callback) {
	        chrome.tabs.query({}, function (tabs) {
	            var urls = tabs.map(function (tab) {
	                return tab.url;
	            }).filter(function (url) {
	                return !!url;
	            });
	            callback(urls);
	        });
	    }
	};

	module.exports = tabs;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var backend = __webpack_require__(8);
	var storage = __webpack_require__(6);

	var sovetnikInfo = __webpack_require__(13);

	var getAdditionalParameters = function getAdditionalParameters() {
	    if (typeof chrome !== 'undefined' && chrome.i18n) {
	        return {
	            locale: chrome.i18n.getUILanguage()
	        };
	    }
	};

	var settingsPromise = undefined;

	/**
	 * Load settings
	 * @return {Promise}
	 */
	function loadSettings() {
	    if (!settingsPromise) {
	        settingsPromise = new Promise(function (resolve) {
	            backend.initExtension(sovetnikInfo.settings, getAdditionalParameters(), function (response) {
	                try {
	                    var data = JSON.parse(response);

	                    resolve(data);
	                } catch (error) {
	                    resolve({});
	                }
	            });
	        });
	    }

	    return settingsPromise;
	}

	module.exports = loadSettings;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory(__webpack_require__(20));
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define(["./core"], factory);
		}
		else {
			// Global (browser)
			factory(root.CryptoJS);
		}
	}(this, function (CryptoJS) {

		(function (Math) {
		    // Shortcuts
		    var C = CryptoJS;
		    var C_lib = C.lib;
		    var WordArray = C_lib.WordArray;
		    var Hasher = C_lib.Hasher;
		    var C_algo = C.algo;

		    // Constants table
		    var T = [];

		    // Compute constants
		    (function () {
		        for (var i = 0; i < 64; i++) {
		            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
		        }
		    }());

		    /**
		     * MD5 hash algorithm.
		     */
		    var MD5 = C_algo.MD5 = Hasher.extend({
		        _doReset: function () {
		            this._hash = new WordArray.init([
		                0x67452301, 0xefcdab89,
		                0x98badcfe, 0x10325476
		            ]);
		        },

		        _doProcessBlock: function (M, offset) {
		            // Swap endian
		            for (var i = 0; i < 16; i++) {
		                // Shortcuts
		                var offset_i = offset + i;
		                var M_offset_i = M[offset_i];

		                M[offset_i] = (
		                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
		                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
		                );
		            }

		            // Shortcuts
		            var H = this._hash.words;

		            var M_offset_0  = M[offset + 0];
		            var M_offset_1  = M[offset + 1];
		            var M_offset_2  = M[offset + 2];
		            var M_offset_3  = M[offset + 3];
		            var M_offset_4  = M[offset + 4];
		            var M_offset_5  = M[offset + 5];
		            var M_offset_6  = M[offset + 6];
		            var M_offset_7  = M[offset + 7];
		            var M_offset_8  = M[offset + 8];
		            var M_offset_9  = M[offset + 9];
		            var M_offset_10 = M[offset + 10];
		            var M_offset_11 = M[offset + 11];
		            var M_offset_12 = M[offset + 12];
		            var M_offset_13 = M[offset + 13];
		            var M_offset_14 = M[offset + 14];
		            var M_offset_15 = M[offset + 15];

		            // Working varialbes
		            var a = H[0];
		            var b = H[1];
		            var c = H[2];
		            var d = H[3];

		            // Computation
		            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
		            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
		            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
		            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
		            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
		            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
		            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
		            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
		            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
		            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
		            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
		            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
		            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
		            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
		            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
		            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

		            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
		            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
		            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
		            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
		            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
		            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
		            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
		            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
		            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
		            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
		            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
		            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
		            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
		            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
		            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
		            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

		            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
		            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
		            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
		            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
		            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
		            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
		            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
		            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
		            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
		            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
		            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
		            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
		            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
		            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
		            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
		            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

		            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
		            d = II(d, a, b, c, M_offset_7,  10, T[49]);
		            c = II(c, d, a, b, M_offset_14, 15, T[50]);
		            b = II(b, c, d, a, M_offset_5,  21, T[51]);
		            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
		            d = II(d, a, b, c, M_offset_3,  10, T[53]);
		            c = II(c, d, a, b, M_offset_10, 15, T[54]);
		            b = II(b, c, d, a, M_offset_1,  21, T[55]);
		            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
		            d = II(d, a, b, c, M_offset_15, 10, T[57]);
		            c = II(c, d, a, b, M_offset_6,  15, T[58]);
		            b = II(b, c, d, a, M_offset_13, 21, T[59]);
		            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
		            d = II(d, a, b, c, M_offset_11, 10, T[61]);
		            c = II(c, d, a, b, M_offset_2,  15, T[62]);
		            b = II(b, c, d, a, M_offset_9,  21, T[63]);

		            // Intermediate hash value
		            H[0] = (H[0] + a) | 0;
		            H[1] = (H[1] + b) | 0;
		            H[2] = (H[2] + c) | 0;
		            H[3] = (H[3] + d) | 0;
		        },

		        _doFinalize: function () {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;

		            var nBitsTotal = this._nDataBytes * 8;
		            var nBitsLeft = data.sigBytes * 8;

		            // Add padding
		            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

		            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
		            var nBitsTotalL = nBitsTotal;
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
		                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
		            );
		            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
		                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
		                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
		            );

		            data.sigBytes = (dataWords.length + 1) * 4;

		            // Hash final blocks
		            this._process();

		            // Shortcuts
		            var hash = this._hash;
		            var H = hash.words;

		            // Swap endian
		            for (var i = 0; i < 4; i++) {
		                // Shortcut
		                var H_i = H[i];

		                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
		                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
		            }

		            // Return final computed hash
		            return hash;
		        },

		        clone: function () {
		            var clone = Hasher.clone.call(this);
		            clone._hash = this._hash.clone();

		            return clone;
		        }
		    });

		    function FF(a, b, c, d, x, s, t) {
		        var n = a + ((b & c) | (~b & d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }

		    function GG(a, b, c, d, x, s, t) {
		        var n = a + ((b & d) | (c & ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }

		    function HH(a, b, c, d, x, s, t) {
		        var n = a + (b ^ c ^ d) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }

		    function II(a, b, c, d, x, s, t) {
		        var n = a + (c ^ (b | ~d)) + x + t;
		        return ((n << s) | (n >>> (32 - s))) + b;
		    }

		    /**
		     * Shortcut function to the hasher's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     *
		     * @return {WordArray} The hash.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hash = CryptoJS.MD5('message');
		     *     var hash = CryptoJS.MD5(wordArray);
		     */
		    C.MD5 = Hasher._createHelper(MD5);

		    /**
		     * Shortcut function to the HMAC's object interface.
		     *
		     * @param {WordArray|string} message The message to hash.
		     * @param {WordArray|string} key The secret key.
		     *
		     * @return {WordArray} The HMAC.
		     *
		     * @static
		     *
		     * @example
		     *
		     *     var hmac = CryptoJS.HmacMD5(message, key);
		     */
		    C.HmacMD5 = Hasher._createHmacHelper(MD5);
		}(Math));


		return CryptoJS.MD5;

	}));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	;(function (root, factory) {
		if (true) {
			// CommonJS
			module.exports = exports = factory();
		}
		else if (typeof define === "function" && define.amd) {
			// AMD
			define([], factory);
		}
		else {
			// Global (browser)
			root.CryptoJS = factory();
		}
	}(this, function () {

		/**
		 * CryptoJS core components.
		 */
		var CryptoJS = CryptoJS || (function (Math, undefined) {
		    /**
		     * CryptoJS namespace.
		     */
		    var C = {};

		    /**
		     * Library namespace.
		     */
		    var C_lib = C.lib = {};

		    /**
		     * Base object for prototypal inheritance.
		     */
		    var Base = C_lib.Base = (function () {
		        function F() {}

		        return {
		            /**
		             * Creates a new object that inherits from this object.
		             *
		             * @param {Object} overrides Properties to copy into the new object.
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         field: 'value',
		             *
		             *         method: function () {
		             *         }
		             *     });
		             */
		            extend: function (overrides) {
		                // Spawn
		                F.prototype = this;
		                var subtype = new F();

		                // Augment
		                if (overrides) {
		                    subtype.mixIn(overrides);
		                }

		                // Create default initializer
		                if (!subtype.hasOwnProperty('init')) {
		                    subtype.init = function () {
		                        subtype.$super.init.apply(this, arguments);
		                    };
		                }

		                // Initializer's prototype is the subtype object
		                subtype.init.prototype = subtype;

		                // Reference supertype
		                subtype.$super = this;

		                return subtype;
		            },

		            /**
		             * Extends this object and runs the init method.
		             * Arguments to create() will be passed to init().
		             *
		             * @return {Object} The new object.
		             *
		             * @static
		             *
		             * @example
		             *
		             *     var instance = MyType.create();
		             */
		            create: function () {
		                var instance = this.extend();
		                instance.init.apply(instance, arguments);

		                return instance;
		            },

		            /**
		             * Initializes a newly created object.
		             * Override this method to add some logic when your objects are created.
		             *
		             * @example
		             *
		             *     var MyType = CryptoJS.lib.Base.extend({
		             *         init: function () {
		             *             // ...
		             *         }
		             *     });
		             */
		            init: function () {
		            },

		            /**
		             * Copies properties into this object.
		             *
		             * @param {Object} properties The properties to mix in.
		             *
		             * @example
		             *
		             *     MyType.mixIn({
		             *         field: 'value'
		             *     });
		             */
		            mixIn: function (properties) {
		                for (var propertyName in properties) {
		                    if (properties.hasOwnProperty(propertyName)) {
		                        this[propertyName] = properties[propertyName];
		                    }
		                }

		                // IE won't copy toString using the loop above
		                if (properties.hasOwnProperty('toString')) {
		                    this.toString = properties.toString;
		                }
		            },

		            /**
		             * Creates a copy of this object.
		             *
		             * @return {Object} The clone.
		             *
		             * @example
		             *
		             *     var clone = instance.clone();
		             */
		            clone: function () {
		                return this.init.prototype.extend(this);
		            }
		        };
		    }());

		    /**
		     * An array of 32-bit words.
		     *
		     * @property {Array} words The array of 32-bit words.
		     * @property {number} sigBytes The number of significant bytes in this word array.
		     */
		    var WordArray = C_lib.WordArray = Base.extend({
		        /**
		         * Initializes a newly created word array.
		         *
		         * @param {Array} words (Optional) An array of 32-bit words.
		         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.create();
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
		         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
		         */
		        init: function (words, sigBytes) {
		            words = this.words = words || [];

		            if (sigBytes != undefined) {
		                this.sigBytes = sigBytes;
		            } else {
		                this.sigBytes = words.length * 4;
		            }
		        },

		        /**
		         * Converts this word array to a string.
		         *
		         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
		         *
		         * @return {string} The stringified word array.
		         *
		         * @example
		         *
		         *     var string = wordArray + '';
		         *     var string = wordArray.toString();
		         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
		         */
		        toString: function (encoder) {
		            return (encoder || Hex).stringify(this);
		        },

		        /**
		         * Concatenates a word array to this word array.
		         *
		         * @param {WordArray} wordArray The word array to append.
		         *
		         * @return {WordArray} This word array.
		         *
		         * @example
		         *
		         *     wordArray1.concat(wordArray2);
		         */
		        concat: function (wordArray) {
		            // Shortcuts
		            var thisWords = this.words;
		            var thatWords = wordArray.words;
		            var thisSigBytes = this.sigBytes;
		            var thatSigBytes = wordArray.sigBytes;

		            // Clamp excess bits
		            this.clamp();

		            // Concat
		            if (thisSigBytes % 4) {
		                // Copy one byte at a time
		                for (var i = 0; i < thatSigBytes; i++) {
		                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
		                }
		            } else {
		                // Copy one word at a time
		                for (var i = 0; i < thatSigBytes; i += 4) {
		                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
		                }
		            }
		            this.sigBytes += thatSigBytes;

		            // Chainable
		            return this;
		        },

		        /**
		         * Removes insignificant bits.
		         *
		         * @example
		         *
		         *     wordArray.clamp();
		         */
		        clamp: function () {
		            // Shortcuts
		            var words = this.words;
		            var sigBytes = this.sigBytes;

		            // Clamp
		            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
		            words.length = Math.ceil(sigBytes / 4);
		        },

		        /**
		         * Creates a copy of this word array.
		         *
		         * @return {WordArray} The clone.
		         *
		         * @example
		         *
		         *     var clone = wordArray.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone.words = this.words.slice(0);

		            return clone;
		        },

		        /**
		         * Creates a word array filled with random bytes.
		         *
		         * @param {number} nBytes The number of random bytes to generate.
		         *
		         * @return {WordArray} The random word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.lib.WordArray.random(16);
		         */
		        random: function (nBytes) {
		            var words = [];

		            var r = (function (m_w) {
		                var m_w = m_w;
		                var m_z = 0x3ade68b1;
		                var mask = 0xffffffff;

		                return function () {
		                    m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
		                    m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
		                    var result = ((m_z << 0x10) + m_w) & mask;
		                    result /= 0x100000000;
		                    result += 0.5;
		                    return result * (Math.random() > .5 ? 1 : -1);
		                }
		            });

		            for (var i = 0, rcache; i < nBytes; i += 4) {
		                var _r = r((rcache || Math.random()) * 0x100000000);

		                rcache = _r() * 0x3ade67b7;
		                words.push((_r() * 0x100000000) | 0);
		            }

		            return new WordArray.init(words, nBytes);
		        }
		    });

		    /**
		     * Encoder namespace.
		     */
		    var C_enc = C.enc = {};

		    /**
		     * Hex encoding strategy.
		     */
		    var Hex = C_enc.Hex = {
		        /**
		         * Converts a word array to a hex string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The hex string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;

		            // Convert
		            var hexChars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                hexChars.push((bite >>> 4).toString(16));
		                hexChars.push((bite & 0x0f).toString(16));
		            }

		            return hexChars.join('');
		        },

		        /**
		         * Converts a hex string to a word array.
		         *
		         * @param {string} hexStr The hex string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
		         */
		        parse: function (hexStr) {
		            // Shortcut
		            var hexStrLength = hexStr.length;

		            // Convert
		            var words = [];
		            for (var i = 0; i < hexStrLength; i += 2) {
		                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
		            }

		            return new WordArray.init(words, hexStrLength / 2);
		        }
		    };

		    /**
		     * Latin1 encoding strategy.
		     */
		    var Latin1 = C_enc.Latin1 = {
		        /**
		         * Converts a word array to a Latin1 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The Latin1 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            // Shortcuts
		            var words = wordArray.words;
		            var sigBytes = wordArray.sigBytes;

		            // Convert
		            var latin1Chars = [];
		            for (var i = 0; i < sigBytes; i++) {
		                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
		                latin1Chars.push(String.fromCharCode(bite));
		            }

		            return latin1Chars.join('');
		        },

		        /**
		         * Converts a Latin1 string to a word array.
		         *
		         * @param {string} latin1Str The Latin1 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
		         */
		        parse: function (latin1Str) {
		            // Shortcut
		            var latin1StrLength = latin1Str.length;

		            // Convert
		            var words = [];
		            for (var i = 0; i < latin1StrLength; i++) {
		                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
		            }

		            return new WordArray.init(words, latin1StrLength);
		        }
		    };

		    /**
		     * UTF-8 encoding strategy.
		     */
		    var Utf8 = C_enc.Utf8 = {
		        /**
		         * Converts a word array to a UTF-8 string.
		         *
		         * @param {WordArray} wordArray The word array.
		         *
		         * @return {string} The UTF-8 string.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
		         */
		        stringify: function (wordArray) {
		            try {
		                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
		            } catch (e) {
		                throw new Error('Malformed UTF-8 data');
		            }
		        },

		        /**
		         * Converts a UTF-8 string to a word array.
		         *
		         * @param {string} utf8Str The UTF-8 string.
		         *
		         * @return {WordArray} The word array.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
		         */
		        parse: function (utf8Str) {
		            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
		        }
		    };

		    /**
		     * Abstract buffered block algorithm template.
		     *
		     * The property blockSize must be implemented in a concrete subtype.
		     *
		     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
		     */
		    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
		        /**
		         * Resets this block algorithm's data buffer to its initial state.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm.reset();
		         */
		        reset: function () {
		            // Initial values
		            this._data = new WordArray.init();
		            this._nDataBytes = 0;
		        },

		        /**
		         * Adds new data to this block algorithm's buffer.
		         *
		         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
		         *
		         * @example
		         *
		         *     bufferedBlockAlgorithm._append('data');
		         *     bufferedBlockAlgorithm._append(wordArray);
		         */
		        _append: function (data) {
		            // Convert string to WordArray, else assume WordArray already
		            if (typeof data == 'string') {
		                data = Utf8.parse(data);
		            }

		            // Append
		            this._data.concat(data);
		            this._nDataBytes += data.sigBytes;
		        },

		        /**
		         * Processes available data blocks.
		         *
		         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
		         *
		         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
		         *
		         * @return {WordArray} The processed data.
		         *
		         * @example
		         *
		         *     var processedData = bufferedBlockAlgorithm._process();
		         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
		         */
		        _process: function (doFlush) {
		            // Shortcuts
		            var data = this._data;
		            var dataWords = data.words;
		            var dataSigBytes = data.sigBytes;
		            var blockSize = this.blockSize;
		            var blockSizeBytes = blockSize * 4;

		            // Count blocks ready
		            var nBlocksReady = dataSigBytes / blockSizeBytes;
		            if (doFlush) {
		                // Round up to include partial blocks
		                nBlocksReady = Math.ceil(nBlocksReady);
		            } else {
		                // Round down to include only full blocks,
		                // less the number of blocks that must remain in the buffer
		                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
		            }

		            // Count words ready
		            var nWordsReady = nBlocksReady * blockSize;

		            // Count bytes ready
		            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

		            // Process blocks
		            if (nWordsReady) {
		                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
		                    // Perform concrete-algorithm logic
		                    this._doProcessBlock(dataWords, offset);
		                }

		                // Remove processed words
		                var processedWords = dataWords.splice(0, nWordsReady);
		                data.sigBytes -= nBytesReady;
		            }

		            // Return processed words
		            return new WordArray.init(processedWords, nBytesReady);
		        },

		        /**
		         * Creates a copy of this object.
		         *
		         * @return {Object} The clone.
		         *
		         * @example
		         *
		         *     var clone = bufferedBlockAlgorithm.clone();
		         */
		        clone: function () {
		            var clone = Base.clone.call(this);
		            clone._data = this._data.clone();

		            return clone;
		        },

		        _minBufferSize: 0
		    });

		    /**
		     * Abstract hasher template.
		     *
		     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
		     */
		    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
		        /**
		         * Configuration options.
		         */
		        cfg: Base.extend(),

		        /**
		         * Initializes a newly created hasher.
		         *
		         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
		         *
		         * @example
		         *
		         *     var hasher = CryptoJS.algo.SHA256.create();
		         */
		        init: function (cfg) {
		            // Apply config defaults
		            this.cfg = this.cfg.extend(cfg);

		            // Set initial values
		            this.reset();
		        },

		        /**
		         * Resets this hasher to its initial state.
		         *
		         * @example
		         *
		         *     hasher.reset();
		         */
		        reset: function () {
		            // Reset data buffer
		            BufferedBlockAlgorithm.reset.call(this);

		            // Perform concrete-hasher logic
		            this._doReset();
		        },

		        /**
		         * Updates this hasher with a message.
		         *
		         * @param {WordArray|string} messageUpdate The message to append.
		         *
		         * @return {Hasher} This hasher.
		         *
		         * @example
		         *
		         *     hasher.update('message');
		         *     hasher.update(wordArray);
		         */
		        update: function (messageUpdate) {
		            // Append
		            this._append(messageUpdate);

		            // Update the hash
		            this._process();

		            // Chainable
		            return this;
		        },

		        /**
		         * Finalizes the hash computation.
		         * Note that the finalize operation is effectively a destructive, read-once operation.
		         *
		         * @param {WordArray|string} messageUpdate (Optional) A final message update.
		         *
		         * @return {WordArray} The hash.
		         *
		         * @example
		         *
		         *     var hash = hasher.finalize();
		         *     var hash = hasher.finalize('message');
		         *     var hash = hasher.finalize(wordArray);
		         */
		        finalize: function (messageUpdate) {
		            // Final message update
		            if (messageUpdate) {
		                this._append(messageUpdate);
		            }

		            // Perform concrete-hasher logic
		            var hash = this._doFinalize();

		            return hash;
		        },

		        blockSize: 512/32,

		        /**
		         * Creates a shortcut function to a hasher's object interface.
		         *
		         * @param {Hasher} hasher The hasher to create a helper for.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
		         */
		        _createHelper: function (hasher) {
		            return function (message, cfg) {
		                return new hasher.init(cfg).finalize(message);
		            };
		        },

		        /**
		         * Creates a shortcut function to the HMAC's object interface.
		         *
		         * @param {Hasher} hasher The hasher to use in this HMAC helper.
		         *
		         * @return {Function} The shortcut function.
		         *
		         * @static
		         *
		         * @example
		         *
		         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
		         */
		        _createHmacHelper: function (hasher) {
		            return function (message, key) {
		                return new C_algo.HMAC.init(hasher, key).finalize(message);
		            };
		        }
		    });

		    /**
		     * Algorithm namespace.
		     */
		    var C_algo = C.algo = {};

		    return C;
		}(Math));


		return CryptoJS;

	}));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! https://mths.be/punycode v1.4.1 by @mathias */
	;(function(root) {

		/** Detect free variables */
		var freeExports = typeof exports == 'object' && exports &&
			!exports.nodeType && exports;
		var freeModule = typeof module == 'object' && module &&
			!module.nodeType && module;
		var freeGlobal = typeof global == 'object' && global;
		if (
			freeGlobal.global === freeGlobal ||
			freeGlobal.window === freeGlobal ||
			freeGlobal.self === freeGlobal
		) {
			root = freeGlobal;
		}

		/**
		 * The `punycode` object.
		 * @name punycode
		 * @type Object
		 */
		var punycode,

		/** Highest positive signed 32-bit float value */
		maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

		/** Bootstring parameters */
		base = 36,
		tMin = 1,
		tMax = 26,
		skew = 38,
		damp = 700,
		initialBias = 72,
		initialN = 128, // 0x80
		delimiter = '-', // '\x2D'

		/** Regular expressions */
		regexPunycode = /^xn--/,
		regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
		regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

		/** Error messages */
		errors = {
			'overflow': 'Overflow: input needs wider integers to process',
			'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
			'invalid-input': 'Invalid input'
		},

		/** Convenience shortcuts */
		baseMinusTMin = base - tMin,
		floor = Math.floor,
		stringFromCharCode = String.fromCharCode,

		/** Temporary variable */
		key;

		/*--------------------------------------------------------------------------*/

		/**
		 * A generic error utility function.
		 * @private
		 * @param {String} type The error type.
		 * @returns {Error} Throws a `RangeError` with the applicable error message.
		 */
		function error(type) {
			throw new RangeError(errors[type]);
		}

		/**
		 * A generic `Array#map` utility function.
		 * @private
		 * @param {Array} array The array to iterate over.
		 * @param {Function} callback The function that gets called for every array
		 * item.
		 * @returns {Array} A new array of values returned by the callback function.
		 */
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) {
				result[length] = fn(array[length]);
			}
			return result;
		}

		/**
		 * A simple `Array#map`-like wrapper to work with domain name strings or email
		 * addresses.
		 * @private
		 * @param {String} domain The domain name or email address.
		 * @param {Function} callback The function that gets called for every
		 * character.
		 * @returns {Array} A new string of characters returned by the callback
		 * function.
		 */
		function mapDomain(string, fn) {
			var parts = string.split('@');
			var result = '';
			if (parts.length > 1) {
				// In email addresses, only the domain name should be punycoded. Leave
				// the local part (i.e. everything up to `@`) intact.
				result = parts[0] + '@';
				string = parts[1];
			}
			// Avoid `split(regex)` for IE8 compatibility. See #17.
			string = string.replace(regexSeparators, '\x2E');
			var labels = string.split('.');
			var encoded = map(labels, fn).join('.');
			return result + encoded;
		}

		/**
		 * Creates an array containing the numeric code points of each Unicode
		 * character in the string. While JavaScript uses UCS-2 internally,
		 * this function will convert a pair of surrogate halves (each of which
		 * UCS-2 exposes as separate characters) into a single code point,
		 * matching UTF-16.
		 * @see `punycode.ucs2.encode`
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode.ucs2
		 * @name decode
		 * @param {String} string The Unicode input string (UCS-2).
		 * @returns {Array} The new array of code points.
		 */
		function ucs2decode(string) {
			var output = [],
			    counter = 0,
			    length = string.length,
			    value,
			    extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}

		/**
		 * Creates a string based on an array of numeric code points.
		 * @see `punycode.ucs2.decode`
		 * @memberOf punycode.ucs2
		 * @name encode
		 * @param {Array} codePoints The array of numeric code points.
		 * @returns {String} The new Unicode string (UCS-2).
		 */
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = '';
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
				return output;
			}).join('');
		}

		/**
		 * Converts a basic code point into a digit/integer.
		 * @see `digitToBasic()`
		 * @private
		 * @param {Number} codePoint The basic numeric code point value.
		 * @returns {Number} The numeric value of a basic code point (for use in
		 * representing integers) in the range `0` to `base - 1`, or `base` if
		 * the code point does not represent a value.
		 */
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) {
				return codePoint - 22;
			}
			if (codePoint - 65 < 26) {
				return codePoint - 65;
			}
			if (codePoint - 97 < 26) {
				return codePoint - 97;
			}
			return base;
		}

		/**
		 * Converts a digit/integer into a basic code point.
		 * @see `basicToDigit()`
		 * @private
		 * @param {Number} digit The numeric value of a basic code point.
		 * @returns {Number} The basic code point whose value (when used for
		 * representing integers) is `digit`, which needs to be in the range
		 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		 * used; else, the lowercase form is used. The behavior is undefined
		 * if `flag` is non-zero and `digit` has no uppercase form.
		 */
		function digitToBasic(digit, flag) {
			//  0..25 map to ASCII a..z or A..Z
			// 26..35 map to ASCII 0..9
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}

		/**
		 * Bias adaptation function as per section 3.4 of RFC 3492.
		 * https://tools.ietf.org/html/rfc3492#section-3.4
		 * @private
		 */
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
				delta = floor(delta / baseMinusTMin);
			}
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}

		/**
		 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
		 * symbols.
		 * @memberOf punycode
		 * @param {String} input The Punycode string of ASCII-only symbols.
		 * @returns {String} The resulting string of Unicode symbols.
		 */
		function decode(input) {
			// Don't use UCS-2
			var output = [],
			    inputLength = input.length,
			    out,
			    i = 0,
			    n = initialN,
			    bias = initialBias,
			    basic,
			    j,
			    index,
			    oldi,
			    w,
			    k,
			    digit,
			    t,
			    /** Cached calculation results */
			    baseMinusT;

			// Handle the basic code points: let `basic` be the number of input code
			// points before the last delimiter, or `0` if there is none, then copy
			// the first basic code points to the output.

			basic = input.lastIndexOf(delimiter);
			if (basic < 0) {
				basic = 0;
			}

			for (j = 0; j < basic; ++j) {
				// if it's not a basic code point
				if (input.charCodeAt(j) >= 0x80) {
					error('not-basic');
				}
				output.push(input.charCodeAt(j));
			}

			// Main decoding loop: start just after the last delimiter if any basic code
			// points were copied; start at the beginning otherwise.

			for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

				// `index` is the index of the next character to be consumed.
				// Decode a generalized variable-length integer into `delta`,
				// which gets added to `i`. The overflow checking is easier
				// if we increase `i` as we go, then subtract off its starting
				// value at the end to obtain `delta`.
				for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

					if (index >= inputLength) {
						error('invalid-input');
					}

					digit = basicToDigit(input.charCodeAt(index++));

					if (digit >= base || digit > floor((maxInt - i) / w)) {
						error('overflow');
					}

					i += digit * w;
					t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

					if (digit < t) {
						break;
					}

					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) {
						error('overflow');
					}

					w *= baseMinusT;

				}

				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);

				// `i` was supposed to wrap around from `out` to `0`,
				// incrementing `n` each time, so we'll fix that now:
				if (floor(i / out) > maxInt - n) {
					error('overflow');
				}

				n += floor(i / out);
				i %= out;

				// Insert `n` at position `i` of the output
				output.splice(i++, 0, n);

			}

			return ucs2encode(output);
		}

		/**
		 * Converts a string of Unicode symbols (e.g. a domain name label) to a
		 * Punycode string of ASCII-only symbols.
		 * @memberOf punycode
		 * @param {String} input The string of Unicode symbols.
		 * @returns {String} The resulting Punycode string of ASCII-only symbols.
		 */
		function encode(input) {
			var n,
			    delta,
			    handledCPCount,
			    basicLength,
			    bias,
			    j,
			    m,
			    q,
			    k,
			    t,
			    currentValue,
			    output = [],
			    /** `inputLength` will hold the number of code points in `input`. */
			    inputLength,
			    /** Cached calculation results */
			    handledCPCountPlusOne,
			    baseMinusT,
			    qMinusT;

			// Convert the input in UCS-2 to Unicode
			input = ucs2decode(input);

			// Cache the length
			inputLength = input.length;

			// Initialize the state
			n = initialN;
			delta = 0;
			bias = initialBias;

			// Handle the basic code points
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 0x80) {
					output.push(stringFromCharCode(currentValue));
				}
			}

			handledCPCount = basicLength = output.length;

			// `handledCPCount` is the number of code points that have been handled;
			// `basicLength` is the number of basic code points.

			// Finish the basic string - if it is not empty - with a delimiter
			if (basicLength) {
				output.push(delimiter);
			}

			// Main encoding loop:
			while (handledCPCount < inputLength) {

				// All non-basic code points < n have been handled already. Find the next
				// larger one:
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) {
						m = currentValue;
					}
				}

				// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
				// but guard against overflow
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
					error('overflow');
				}

				delta += (m - n) * handledCPCountPlusOne;
				n = m;

				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];

					if (currentValue < n && ++delta > maxInt) {
						error('overflow');
					}

					if (currentValue == n) {
						// Represent delta as a generalized variable-length integer
						for (q = delta, k = base; /* no condition */; k += base) {
							t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
							if (q < t) {
								break;
							}
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(
								stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
							);
							q = floor(qMinusT / baseMinusT);
						}

						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}

				++delta;
				++n;

			}
			return output.join('');
		}

		/**
		 * Converts a Punycode string representing a domain name or an email address
		 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		 * it doesn't matter if you call it on a string that has already been
		 * converted to Unicode.
		 * @memberOf punycode
		 * @param {String} input The Punycoded domain name or email address to
		 * convert to Unicode.
		 * @returns {String} The Unicode representation of the given Punycode
		 * string.
		 */
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string)
					? decode(string.slice(4).toLowerCase())
					: string;
			});
		}

		/**
		 * Converts a Unicode string representing a domain name or an email address to
		 * Punycode. Only the non-ASCII parts of the domain name will be converted,
		 * i.e. it doesn't matter if you call it with a domain that's already in
		 * ASCII.
		 * @memberOf punycode
		 * @param {String} input The domain name or email address to convert, as a
		 * Unicode string.
		 * @returns {String} The Punycode representation of the given domain name or
		 * email address.
		 */
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string)
					? 'xn--' + encode(string)
					: string;
			});
		}

		/*--------------------------------------------------------------------------*/

		/** Define the public API */
		punycode = {
			/**
			 * A string representing the current Punycode.js version number.
			 * @memberOf punycode
			 * @type String
			 */
			'version': '1.4.1',
			/**
			 * An object of methods to convert from JavaScript's internal character
			 * representation (UCS-2) to Unicode code points, and back.
			 * @see <https://mathiasbynens.be/notes/javascript-encoding>
			 * @memberOf punycode
			 * @type Object
			 */
			'ucs2': {
				'decode': ucs2decode,
				'encode': ucs2encode
			},
			'decode': decode,
			'encode': encode,
			'toASCII': toASCII,
			'toUnicode': toUnicode
		};

		/** Expose `punycode` */
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return punycode;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		} else if (freeExports && freeModule) {
			if (module.exports == freeExports) {
				// in Node.js, io.js, or RingoJS v0.8.0+
				freeModule.exports = punycode;
			} else {
				// in Narwhal or RingoJS v0.7.0-
				for (key in punycode) {
					punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
				}
			}
		} else {
			// in Rhino or a web browser
			root.punycode = punycode;
		}

	}(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22)(module), (function() { return this; }())))

/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var backend = __webpack_require__(8);
	var sovetnikInfo = __webpack_require__(13);
	var storage = __webpack_require__(6);

	var _require = __webpack_require__(11);

	var setInterval = _require.setInterval;

	var PING_INTERVAL = 12 * 60 * 60 * 1000;
	//#if firefox-webextension
	PING_INTERVAL = 24 * 60 * 60 * 1000;
	//end

	var CHECK_INTERVAL = 30 * 60 * 1000;
	var FIRST_CHECK_INTERVAL = 60 * 1000;

	function canSendPing() {
	    return !sovetnikInfo.isUserAgreementRejected() && !sovetnikInfo.isSovetnikRemoved;
	}

	function isTimeToSendPing() {
	    var lastSentTime = storage.get('ping_last_sent_time') || 0;
	    lastSentTime = parseInt(lastSentTime, 10);
	    return new Date().getTime() - lastSentTime > PING_INTERVAL;
	}

	function trySendPing() {
	    if (canSendPing && isTimeToSendPing()) {
	        var settings = {
	            affId: sovetnikInfo.settings.affId,
	            clid: sovetnikInfo.settings.clid
	        };

	        if (sovetnikInfo.settings.withButton) {
	            settings.withButton = true;
	        }

	        backend.sendSovetnikStats({
	            settings: settings,
	            event: 'ping'
	        }, function () {
	            storage.set('ping_last_sent_time', new Date().getTime());
	        });
	    }
	}

	if (canSendPing()) {
	    setTimeout(trySendPing, FIRST_CHECK_INTERVAL);
	    setInterval(trySendPing, CHECK_INTERVAL);
	}

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var API = __webpack_require__(25);
	var global = typeof window === 'undefined' ? undefined : window;

	var sovetnik = API || {};

	global.sovetnik = sovetnik;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var siteInfo = __webpack_require__(5);
	var sovetnikInfo = __webpack_require__(13);

	var API = {
	    /**
	     * @name API_handler
	     * @function
	     * @param {String} currentUrl
	     * @param {String} referrerUrl
	     */

	    /**
	     * set custom check function to disable Sovetnik according to current URL and referrer URL
	     * @param {API_handler} handler
	     */
	    setCheckFunction: function setCheckFunction(handler) {
	        siteInfo.setCustomCheckFunction(handler);
	    },

	    setOpenSettingsFunction: function setOpenSettingsFunction(handler) {
	        sovetnikInfo.setCustomSettingsPage(handler);
	    },
	    /**
	     * enable or disable shops' popup onHover showing
	     * @param {Boolean} isEnabled
	     */
	    setAutoShowPopup: function setAutoShowPopup(isEnabled) {
	        sovetnikInfo.setUserSetting('autoShowShopList', isEnabled);
	    },

	    /**
	     * set current user's city
	     * @param {Number} cityId
	     */
	    setActiveCity: function setActiveCity(cityId) {
	        sovetnikInfo.setUserSetting('activeCity', { id: cityId });
	    },

	    /**
	     * set current user's country
	     * @param {Number} countryId
	     */
	    setActiveCountry: function setActiveCountry(countryId) {
	        sovetnikInfo.setUserSetting('activeCountry', { id: countryId });
	    },

	    setAutoDetectRegion: function setAutoDetectRegion() {
	        sovetnikInfo.setUserSetting('activeCity', null);
	        sovetnikInfo.setUserSetting('activeCountry', null);
	    },

	    /**
	     * set true if user wants to receive offers from other regions or false if he doesn't
	     * @param {Boolean} otherRegionsEnabled
	     */
	    setOtherRegions: function setOtherRegions(otherRegionsEnabled) {
	        sovetnikInfo.setUserSetting('otherRegions', otherRegionsEnabled);
	    },

	    /**
	     * set sovetnik removed state
	     * @param {Boolean} state
	     */
	    setRemovedState: function setRemovedState(state) {
	        sovetnikInfo.setSovetnikRemovedState(state);
	    },

	    getUserAgreementStatus: function getUserAgreementStatus() {
	        return sovetnikInfo.userAgreementStatus;
	    },
	    
	    setUserAgreementStatus: function setUserAgreementStatus(status) {
            return sovetnikInfo.setUserAgreementStatus(status);
        }
	};

	module.exports = API;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * © 2017 ООО «Яндекс.Маркет» / © 2017 Yandex.Market LLC
	 */

	'use strict';

	var backend = __webpack_require__(8);
	var sovetnikInfo = __webpack_require__(13);

	if (!sovetnikInfo.settings.silent) {
	  backend.setStartedInfo();
	}

/***/ }
/******/ ]);
}