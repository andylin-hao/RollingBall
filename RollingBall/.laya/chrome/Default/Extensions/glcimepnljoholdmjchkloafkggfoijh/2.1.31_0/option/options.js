var promoInstalled = null;
var promoEnabled = null;

function showEnableWebProtectionDesc(retry) {
    chrome.runtime.sendMessage({text: Request.get_product_id}, function(response) {
        retry--;
        consoleLog("showEnableWebProtectionDesc:" + retry);
        
        if (retry == 0) {
            return;
        } else if (response == undefined) {
            setTimeout(function() {
                showEnableWebProtectionDesc(retry);
            }, 200);
            return;
        }
        
        var error = document.getElementById("error-msg");
        error.textContent = getEnableWebProtectionDesc(response);
    });
}

function showAboutPannel(retry) {
    chrome.runtime.sendMessage({text: Request.get_product_id}, function(response) {
        retry--;
        consoleLog("showAboutPannel:" + retry);
        
        if (retry == 0) {
            return;
        } else if (response == undefined) {
            setTimeout(function() {
                showAboutPannel(retry);
            }, 200);
            return;
        }
        
        var imgPath = getLogoImage(response);
        var logo = document.getElementById("logo");
        if (imgPath == null) {
            logo.style.display = 'none';
        } else {
            logo.src = imgPath;
        }
        
        var productUrl = getProductLink(response, false);
        if (productUrl == null) {
            document.getElementById("about-pannel").style.display = 'none';
            return;
        }
        
        document.getElementById("about-text").textContent = chrome.i18n.getMessage('about');
        document.getElementById("official-website-text").textContent = productUrl;
        document.getElementById("official-website-text").addEventListener('click', function(e) {
            chrome.tabs.create({url: getProductLink(response, true)});
        });
        
        var fbUrl = getFBLinkUrl(response);
        if (fbUrl == null) {
            document.getElementById("fb-website").style.display = 'none';
        } else {
            document.getElementById("about-text").textContent = chrome.i18n.getMessage('about');
            document.getElementById("fb-website-text").textContent = fbUrl;
            document.getElementById("fb-website-text").addEventListener('click', function(e) {
                chrome.tabs.create({url:fbUrl});
            });
        }
        
        document.getElementById("copyright").textContent = getCopyRightDesc();
    });
}

function showPromoSwitchPannel(shown) {
    if (shown) {
        document.getElementById("sovetnik").style.display = 'block';
        document.getElementById("enable-sovetnik-text").textContent = chrome.i18n.getMessage('enable_similar_items_searching');
        
        getPref(promoEnabled, null, function(value) {
            document.getElementById("enable-sovetnik-switch").src = value ? "../images/switch_on.png" : "../images/switch_off.png";
        });
    } else {
        document.getElementById("sovetnik").style.display = 'none';
    }
}

function propPromoInstalledListener(changedValue) {
    showPromoSwitchPannel(changedValue.newValue);
}

function propPromoEnabledLintener(changedValue) {
    document.getElementById("enable-sovetnik-switch").src = changedValue.newValue ? "../images/switch_on.png" : "../images/switch_off.png";
}

function showControlPannel(compatibility, pid) {
    if (compatibility != CompatibleState.compatible) {
        document.getElementById("settings-pannel").style.display = 'none';
        return;
    }
    
    document.getElementById("settings-title").textContent = chrome.i18n.getMessage('option_page_title');
    
    initEnableShoppingProtectionHint();
    initEnableToolrMsg();
    initPrivacyMsg(pid, '');
    
    if (isStoreConsultantAvailable(pid)) {
        promoInstalled = Prop.sovetnik_installed;
        promoEnabled = Prop.sovetnik_enabled;
    } else if (isCiuvoAvailable(pid)) {
        promoInstalled = Prop.dealprice_installed;
        promoEnabled = Prop.dealprice_enabled;
    } else {
        return;
    }
    
    registerPrefOnChanged(promoInstalled, propPromoInstalledListener);
    
    registerPrefOnChanged(promoEnabled, propPromoEnabledLintener);
    
    window.addEventListener('unload', function() {
        consoleLog('option unload');
        
        unregisterPrefOnChanged(propPromoInstalledListener);
        unregisterPrefOnChanged(propPromoEnabledLintener);
    }, false);
    
    document.getElementById("enable-sovetnik-switch").addEventListener('click', function(e) {
        var curChecked = this.src.includes("switch_on");
        setPref(promoEnabled, !curChecked);
    });
    
    getPref(promoInstalled, false, function(value) {
        if (value == false) {
            consoleLog("showAboutPannel: " + promoInstalled + " not installed");
            return;
        }
        showPromoSwitchPannel(true);
    });
}

function initEnableShoppingProtectionHint() {
    document.getElementById("enable-toast-text").textContent = chrome.i18n.getMessage('enable_toast');
    document.getElementById("enable-toast-switch").addEventListener('click', function(e) {
        var curChecked = this.src.includes("switch_on");
        if (curChecked) {
            setPref(Prop.enable_toast, false);
        } else {
            setPref(Prop.enable_toast, true);
        }
        document.getElementById("enable-toast-switch").src = curChecked ? "../images/switch_off.png" : "../images/switch_on.png";
    });
    getPref(Prop.enable_toast, true, function(value) {
        document.getElementById("enable-toast-switch").src = value ? "../images/switch_on.png" : "../images/switch_off.png";
    });
}

function initEnableToolrMsg() {
    document.getElementById("enable-toolbar-text").textContent = chrome.i18n.getMessage('enable_toolbar_icon');
    document.getElementById("enable-toolbar-switch").addEventListener('click', function(e) {
        var curChecked = this.src.includes("switch_on");
        if (curChecked) {
            setPref(Prop.enable_toolbar, false);
            chrome.runtime.sendMessage({text: Request.enable_toolbar_icon, state: false}, function(response) {
            });
        } else {
            setPref(Prop.enable_toolbar, true);
            chrome.runtime.sendMessage({text: Request.enable_toolbar_icon, state: true}, function(response) {
            });
        }
        document.getElementById("enable-toolbar-switch").src = curChecked ? "../images/switch_off.png" : "../images/switch_on.png";
    });
    getPref(Prop.enable_toolbar, true, function(value) {
        document.getElementById("enable-toolbar-switch").src = value ? "../images/switch_on.png" : "../images/switch_off.png";
    });
}

function initPrivacyMsg(pid, postfix) {
    var learnMoreUrl = getPrivacyPolicyLinkUrl(pid);
    document.getElementById("learn-more-text" + postfix).textContent = chrome.i18n.getMessage('learn_more');
    document.getElementById("learn-more-text" + postfix).addEventListener('click', function(e) {
        chrome.tabs.create({url:learnMoreUrl});
    });
    document.getElementById("checkbox-privacy-text" + postfix).textContent = chrome.i18n.getMessage('privacy_policy_desc');
    document.getElementById("checkbox-privacy-switch" + postfix).addEventListener('click', function(e) {
        var curChecked = this.src.includes("checked");
        if (curChecked) {
            setPref(Prop.agree_to_privacy_policy, false);
            chrome.runtime.sendMessage({text: Request.agree_to_privacy_policy, state: false}, function(response) {
            });
        } else {
            setPref(Prop.agree_to_privacy_policy, true);
            chrome.runtime.sendMessage({text: Request.agree_to_privacy_policy, state: true}, function(response) {
            });
        }
        document.getElementById("checkbox-privacy-switch" + postfix).src = curChecked ? "../images/ic_checkbox_normal.png" : "../images/ic_checkbox_checked.png";
    });
    getPref(Prop.agree_to_privacy_policy, true, function(value) {
        document.getElementById("checkbox-privacy-switch" + postfix).src = value ? "../images/ic_checkbox_checked.png" : "../images/ic_checkbox_normal.png";
    });
}

function initLayout(response) {
    consoleLog("initLayout:" + JSON.stringify(response));
    
    if (response.state == CompatibleState.compatible || response.state == CompatibleState.base) {
        document.getElementById("option-pannel").style.display = 'block';
        
        showControlPannel(response.state, response.pid);
        showAboutPannel(10);
        return;
    }
    
    var error = document.getElementById("error-msg");
    error.style.display = 'block';
    
    /*
    if (response.state == CompatibleState.none) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            var tab = tabs[0];
            url = "http://info.url.cloud.360safe.com/plugin/plug.php?la=" + getUILang() + "&rq=1";
            chrome.tabs.update(tabs.id, { url: url });
        });
    } else */
    if (response.state == CompatibleState.none || response.state == CompatibleState.upgrade_env) { // CompatibleState.none is canonical plugin
        document.getElementById("upgrade_pannel").style.display = 'block';
    
        var message = document.getElementById('upgrade_message');
        message.textContent = chrome.i18n.getMessage('upgrade_env_message');
        
        var url360safe = document.getElementById('upgrade_360safe');
        var url360ts = document.getElementById('upgrade_360ts');
        
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
                
                //TODO: privacy show two links.
            }
            
            url360ts.textContent = chrome.i18n.getMessage('upgrade_360ts');
        }
        
        url360ts.onclick = function(e) {
            chrome.tabs.create({ url: getUpgradeLink(ProductId.ts) });
        };
    } else if (response.state == CompatibleState.upgrade_browser) {
        error.textContent = chrome.i18n.getMessage('upgrade_browser_message');
    } else if (response.state == CompatibleState.upgrade_plugin) {
        document.getElementById("upgrade_pannel").style.display = 'block';
    
        var message = document.getElementById('upgrade_message');
        message.textContent = chrome.i18n.getMessage('upgrade_ext_message');
    
        var url360safe = document.getElementById('upgrade_360safe');
        var url360ts = document.getElementById('upgrade_360ts');
        url360safe.style.display = 'none';
        url360ts.textContent = chrome.i18n.getMessage('upgrade');
        
        browserInfo = getBrowserInfoEx();
        consoleLog("DOMContentLoaded -> browserInfo.appname:" + browserInfo.appname);
        
        if (browserInfo.appname == 'opera') {
            url360ts.onclick = function(e) {
                chrome.tabs.create({ url: getOperaExtUrl() });
            };
        } else if (browserInfo.appname == 'yandex') {
            url360ts.onclick = function(e) {
                chrome.tabs.create({ url: getYandexExtUrl() });
            };
        } else if (browserInfo.appname == 'chrome') {
            url360ts.onclick = function(e) {
                chrome.tabs.create({ url: getChromeExtUrl() });
            };
        }
    } else if (response.state == CompatibleState.enable_siteaccess) {
        if (getUILang() != 'zh-CN') {
            error.textContent = getEnableWebProtectionDesc(ProductId.ts);
        } else {
            showEnableWebProtectionDesc(10);
        }
    } else if (response.state == CompatibleState.unsupported_platform) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            var tab = tabs[0];
            url = "http://info.url.cloud.360safe.com/plugin/plug.php?la=" + getUILang() + "&rq=3";
            chrome.tabs.update(tabs.id, { url: url });
        });
    }
    
    initPrivacyMsg(ProductId.ts, '-error');
}

function checkCompability(retry) {
    chrome.runtime.sendMessage({text: Request.get_compatiable_state}, function(response) {
        retry--;
        consoleLog("checkCompability -> retry:" + retry);
        
        if (response == undefined || response.state == CompatibleState.none) {
            if (retry == 0) {
                initLayout({state:CompatibleState.none, pid:null});
            } else {
                setTimeout(function() {
                    checkCompability(retry);
                }, 100);
            }
            return;
        }
        
        initLayout(response);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
        checkCompability(10);
    }, 300); // time to confirm CompatibleState.enable_siteaccess 
});
