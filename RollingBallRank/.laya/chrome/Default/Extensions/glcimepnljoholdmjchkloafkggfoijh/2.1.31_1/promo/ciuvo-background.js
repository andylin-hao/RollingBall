/*
 * Copyright 2016 Ciuvo GmbH. All rights reserved.
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE', which is part of this source code package.
 */
function initCiuvoSettings(CONFIG) {

    var whitelistAPI = whitelist = new ciuvoSDK.Whitelist(CONFIG);

    var random_marker = '_csdk_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);

    /**
     * 
     */
    function getContentScript(settings) {
        return "(function(document) {\n"
            + "var ciuvoSettings = " + JSON.stringify(settings) + ";\n"
            + "if (!window." + random_marker + ") {\n"
            + "      window." + random_marker + " = true;\n"
            + "      (new ciuvoSDK.ContentScript(document, ciuvoSettings)).run();\n"
            + "}\n"
            + "})(document);";
    }

    /**
     * Injects the ciuvo-contentscript into the webpage and sends a message to the contentscript,
     * ordering it to run the ciuvoSDK.contentscript.
     * @param the id of the tab to inject into
     */
    function injectContentScript(tabId, settings) {
        consoleLog("Whitelisted, injecting.");
        var details_ciuvo = {file: "promo/ciuvo-contentscript.js", runAt: 'document_start'},
            details_my_cs = {code: getContentScript(settings), runAt: 'document_end'};

        // injects the ciuvo-contentscript.min.js and afterwards sends the message
        chrome.tabs.executeScript(tabId, details_ciuvo, function(result) {
            if (result) {
                chrome.tabs.executeScript(tabId, details_my_cs, function(result) {
                    consoleLog("Injected: " + result);
                });
            }
        });
    }
    
    /**
     * Does Whitelist check, and if it passes, ciuvo's contentscript will be injected.
     **/
    function injectIfWhitelisted(tabId, url) {
        consoleLog("Running whitelist check for " + url);
        var settings = 
            CONFIG,
            success_cb = function() {
                if (com.ciuvo.asdetector.isAffiliateSource(tabId, false)) {
                    consoleLog("afsrc=1 detected, standing down");
                } else {
                    injectContentScript(tabId, settings);
                }
            },
            error_cb = function(error) {
                if (typeof error !== "undefined") {
                    consoleLog("Whitelist check failed:" + error);
                } else {
                    consoleLog("URL is not whitelisted.");
                }
            };
        whitelistAPI.isWhitelisted(url, success_cb, error_cb);
    }
    
    /**
     * Listen for tab url updates
     */
    /*chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        if (typeof changeInfo.status !== 'undefined' 
            && changeInfo.status === 'loading'
            && typeof tab.url !== 'undefined'
            && tab.url.startsWith('http')) {
            consoleLog("Injecting after updated..");
            injectIfWhitelisted(tabId, tab.url);
        }
    });*/
    
    /**
     * Listen for tab updates of instant pages
     */
    /*chrome.webNavigation.onTabReplaced.addListener
    chrome.tabs.onReplaced.addListener(function (addedTabId, removedTabId) {
        chrome.tabs.get(addedTabId, function(tab) {
            if (tab.id && tab.url) {
                consoleLog("Injecting after replaced..");
                injectIfWhitelisted(tab.id, tab.url);
            }
        });
    });*/
    
    return injectIfWhitelisted;
}

