document.addEventListener("DOMContentLoaded", function() {
    var pannel = document.getElementById('upgrade_pannel');
    pannel.style.display = 'block';
    
    var message = document.getElementById('upgrade_message');
    message.textContent = chrome.i18n.getMessage('upgrade_ext_message');
    
    var upgradeButton = document.getElementById('upgrade_plugin');
    upgradeButton.textContent = chrome.i18n.getMessage('upgrade');
    
    browserInfo = getBrowserInfoEx();
    consoleLog("DOMContentLoaded -> browserInfo.appname:" + browserInfo.appname);
    
    if (browserInfo.appname == 'opera') {
        upgradeButton.onclick = function(e) {
            chrome.tabs.create({ url: getOperaExtUrl() });
        };
    } else if (browserInfo.appname == 'yandex') {
        upgradeButton.onclick = function(e) {
            chrome.tabs.create({ url: getYandexExtUrl() });
        };
    } else if (browserInfo.appname == 'chrome') {
        upgradeButton.onclick = function(e) {
            chrome.tabs.create({ url: getChromeExtUrl() });
        };
    }
});
