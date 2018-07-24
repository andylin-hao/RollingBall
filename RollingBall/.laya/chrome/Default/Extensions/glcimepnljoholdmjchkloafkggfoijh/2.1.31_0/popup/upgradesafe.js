document.addEventListener("DOMContentLoaded", function() {
    var pannel = document.getElementById('upgrade_pannel');
    pannel.style.display = 'block';
    
    var message = document.getElementById('upgrade_message');
    message.textContent = chrome.i18n.getMessage('upgrade_env_message');
    
    var url360safe = document.getElementById('upgrade_360safe');
    var url360ts = document.getElementById('upgrade_360ts');
    
    consoleLog("DOMContentLoaded -> getUILang():" + getUILang());
    
    if (getUILang() != 'zh-CN') {
        url360safe.style.display = 'none';
        
        url360ts.textContent = chrome.i18n.getMessage('upgrade');
    } else {
        if (true) { // 360safe don't support new features
            url360safe.style.display = 'none';
        } else {
            url360safe.textContent = chrome.i18n.getMessage('upgrade_360safe');
            url360safe.onclick = function(e) {
                chrome.tabs.create({ url: getUpgradeLink(ProductId.safe) });
            };
        }
        
        url360ts.textContent = chrome.i18n.getMessage('upgrade_360ts');
    }
    
    url360ts.onclick = function(e) {
        chrome.tabs.create({ url: getUpgradeLink(ProductId.ts) });
        window.close();
    };
});
