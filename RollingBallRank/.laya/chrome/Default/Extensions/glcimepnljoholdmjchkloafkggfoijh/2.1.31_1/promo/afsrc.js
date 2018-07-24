/** @suppress {duplicate} */
if (!com)
    var com = {};
if (!com.ciuvo)
    com.ciuvo = {};

/**
 * Helper object for detecting if the user came from a affiliate source and that
 * the extension should stand down completely. This affiliate sources are
 * usually marked by the "afsrc=1" query parameter, but one might also pass the
 * constructor a list of RegExp objects.
 * 
 * NOTE: for Google-Chrome (and other Webkit-derivates) you need to add the
 * "webRequest" permission to the manifest.
 * 
 */
com.ciuvo.ASDetector = (function() {

    var TAB_EVENT_EXPIRATION_TIME = 10 * 1000;

    /**
     * @constructor
     */
    var ASDetector = function(blockref) {
        this.pastEvents = {};
        this.listeners = [];
        this.blockref = blockref || [ new RegExp('\.*&afsrc=1|\\?afsrc=1'),
                new RegExp('.*jdoqocy.com'),
                new RegExp('.*tkqlhce.com'),
                new RegExp('.*dpbolvw.net'),
                new RegExp('.*anrdoezrs.net'),
                new RegExp('.*kqzyfj.com'),
                new RegExp('.*linksynergy\.com'),
                new RegExp('.*linksynergy\.onlineshoes\.com'),
                new RegExp('.*linksynergy\.walmart\.com'),
                new RegExp('.*savings\.com'),
                new RegExp('.*affiliate\.rakuten\.com'),
                ];
        this.ciuvo_rex = [new RegExp('.*ciuvo\.com'), new RegExp('.*localhost:8002')];
    };

    ASDetector.prototype = {
        /**
         * Add a new navigation event of the tab's main frame.
         * 
         * @param tabId
         *            the tabId for this navigation event (required)
         * @param url
         *            the url for this navigation event (required)
         * @param requestId
         *            the request-id if available. It helps recognizing multiple
         *            urls which actually belong to one navigation event because
         *            of redirects. (optional)
         * @param timestamp
         *            the timestamp in ms of the navigation event. It is usefull
         *            for recognizing events which belong together (optional).
         * @param main_page_changed
         *            only used in firefox because there a workaround to recognize main-page changes
         *            is needed
         * @returns true if the current chain of navigation events has been
         *          marked as affiliate source. False otherwise.
         */
        onNavigationEvent : function(tabId, url, requestId, timestamp, main_page_changed) {
            timestamp = timestamp || Date.now();

            var newEvent = true;
            var lastEvent = this.getLastEvent(tabId);

            // try to detect if this is a new navigation event
            if (typeof requestId !== 'undefined') {
                if (requestId == lastEvent.requestId) {
                    newEvent = false;
                }
            }

            // those damn JS redirects make requestId unreliable
            var delta = timestamp - lastEvent.timestamp;
            if ((delta < com.ciuvo.get_afsrc_threshold())) {
                newEvent = false;
            }
            if (lastEvent.isAfsrc)  {
                if (main_page_changed !== undefined)  {
                    if (!main_page_changed) {
                        newEvent = false;
                    }
                } else if (com.ciuvo.hostname_from_url(url) === lastEvent.hostname) {
                    // still on the same event
                    newEvent = false;
                }
            }


            // update timestamp in any case
            lastEvent.timestamp = timestamp;

            // create a new event if one has been detected
            if (newEvent) {
                lastEvent.isAfsrc = false;
                lastEvent.isFromCiuvo = false;
                lastEvent.requestId = requestId;
            }
            lastEvent.hostname = com.ciuvo.hostname_from_url(url);
            // detect that the url is from a ciuvo extension
            for (var i = 0; i < this.ciuvo_rex.length; ++i) {
                if (this.ciuvo_rex[i].exec(url)) {
                    lastEvent.isFromCiuvo = true;
                }
            }
            if (lastEvent.isFromCiuvo) {
                // ignore afsrc if ciuvo itself triggered the coupon-click
                lastEvent.isAfsrc = false;
            } else {
                // check if this is a event that marks an affiliate source
                for (var i = 0; i < this.blockref.length; i++) {
                    if (this.blockref[i].exec(url)) {
                        lastEvent.isAfsrc = true;
                    }
                }
            }

            return lastEvent.isAfsrc;
        },

        /**
         * be nice, clean up a bit after ourselves
         */
        cleanupExpiredTabs : function() {
            now = Date.now();
            for ( var tabId in this.pastEvents) {
                if (this.pastEvents.hasOwnProperty(tabId)) {
                    var event = this.pastEvents[tabId];
                    if ((now - event.timestamp) > TAB_EVENT_EXPIRATION_TIME) {
                        delete this.pastEvents[tabId];
                    }
                }
            }
        },

        /**
         * @param tabId
         *            the tab's id
         * @returns the last navigation event or an empty one
         */
        getLastEvent : function(tabId) {
            var lastEvent = this.pastEvents[tabId];
            if (typeof lastEvent === 'undefined') {
                lastEvent = {
                    isAfsrc : false,
                    requestId : undefined,
                    isFromCiuvo : false,
                    timestamp : 0,
                    hostname: undefined
                };
                this.pastEvents[tabId] = lastEvent;
            }
            return lastEvent;
        },

        /**
         * @param tabId the id of the tab to be checked for the affiliate source
         * @param cleanup will clear the affiliate source flag since displays are allowed
         *          on subsequent requests
         * @returns true if the current chain of navigation events has been
         *          marked as affiliate source. False otherwise.
         */
        isAffiliateSource : function(tabId, cleanup) {
            var isAfsrc = this.getLastEvent(tabId).isAfsrc;
            if (cleanup) {
                delete this.pastEvents[tabId];
            } else {
                this.pastEvents[tabId].timestamp = 0;
                this.pastEvents[tabId].requestId = undefined;
            }

            return isAfsrc;
        }
    };

    return ASDetector;
})();
