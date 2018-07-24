var Prop = {
    "enable_toast" : "enable_toast",
    "enable_toolbar" : "enable_toolbar",
    "agree_to_privacy_policy": "agree_to_privacy_policy",
    "hide_settings" : "hide_settings",
    "sovetnik_installed" : "sovetnik_installed",
    "sovetnik_enabled" : "sovetnik_enabled",
    "dealprice_installed" : "dealprice_installed",
    "dealprice_enabled" : "dealprice_enabled",
    "dealprice_popup_time" : "dealprice_popup_time",
    "dealprice_popup_count" : "dealprice_popup_count",
    "next_dau_time" : "next_dau_time"
}

function setPref(key, value) {
    // localStorage[key] = value;

    var obj = {};
    obj[key] = value;
    chrome.storage.local.set(obj, function() {
        consoleLog("setPref(" + key + ") = value:" + value);
    });
}

function getPref(key, defaultValue, callback) {
    // return localStorage[key];
    chrome.storage.local.get(key,
        function(items) {
            if (items != undefined && items[key] != undefined) {
                callback(items[key]);
                consoleLog("getPref(" + key + ") = value:" + items[key]);
            } else {
                callback(defaultValue);
                consoleLog("getPref(" + key + ") = default value:"
                        + defaultValue);
            }
        });
}

/*
 * callback(changedValue) { var newV = changedValue.newValue; var oldV =
 * changedValue.oldValue;}
 */
function registerPrefOnChanged(key, callback) {
    chrome.storage.onChanged.addListener(function(changed, namespace) {
        if (namespace == 'local') {
            if (changed[key]) {
                consoleLog("registerPrefOnChanged(" + key + "):"
                        + JSON.stringify(changed[key]));
                callback(changed[key]);
            }
        }
    });
}

function unregisterPrefOnChanged(callback) {
    chrome.storage.onChanged.removeListener(callback);
}

function getGlobalValue(key) {
    return localStorage[key];
}

function setGlobalValue(key, value) {
    localStorage[key] = value;
}
