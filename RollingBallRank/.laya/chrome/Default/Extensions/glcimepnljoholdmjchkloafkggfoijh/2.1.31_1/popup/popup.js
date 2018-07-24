var port = chrome.runtime.connect({name: "popup"});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTab = tabs[0];
    consoleLog("callback:" + JSON.stringify(currentTab));
  
    port.postMessage(currentTab);
});

function wrapContent() {
    setTimeout(function(){
        var container = document.getElementsByClassName('body')[0];
        var newHeight = container.clientHeight;
        var diff = newHeight - parseInt(document.body.style.height, 10);
        document.body.style.height = newHeight + "px";
        
        var htmlElement = document.getElementsByTagName("html")[0];
        htmlElement.style.height = newHeight + "px";
    },200)
}

document.addEventListener("DOMContentLoaded", function() {
    chrome.runtime.sendMessage({text: Request.get_product_id}, function(response) {
        consoleLog("get_product_id -> response:" + response);
        
        var productName = getProductName(response);
        consoleLog("productName -> " + productName);
        
        if (productName != null) {
            var caption = document.getElementById("caption");
            caption.textContent = productName;
        }
    });
    
    var imgs = document.getElementsByClassName("setting_icon");
    if (imgs.length > 0) {
        imgs[0].addEventListener("click", function() {
            chrome.tabs.create({ url: "../option/options.html" });
            window.close();
        });
    }
    
    var netpaySwitch = document.getElementById('netpay-switch');
    if (netpaySwitch) {
        netpaySwitch.addEventListener('click', function(ev) {
            consoleLog("netpay-switch click ");
            wrapContent();
        }, false);
    }
    
    var resolveText = document.getElementById('risk-processed');
    if (resolveText) {
        resolveText.addEventListener('click', function(ev) {
            consoleLog("resolveText click ");
            wrapContent();
        }, false);
    }
    
    statPopup();
});

function statPopup() {
    var popupIds = ['safe-container', 'risk-container', 'pay-container', 'shopping-container', 'unknown-container', 'checking-container'];
    
    for (var i = 0; i < popupIds.length; i++) {
        elem = document.getElementById(popupIds[i]);
        if (elem != null) {
            chrome.runtime.sendMessage({text: Request.stat_popup, id: popupIds[i]}, function(response) {
            });
            return;
        }
    }
}
