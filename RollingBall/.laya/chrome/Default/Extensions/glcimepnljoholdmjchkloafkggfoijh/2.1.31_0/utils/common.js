function getBrowserInfoEx() {
    var browser = {
        version: navigator.appVersion, agent: navigator.userAgent,
        appname: navigator.appName, fullversion: ''+parseFloat(navigator.appVersion),
        majorversion: parseInt(navigator.appVersion,10)
    }
    var nameOffset,verOffset,ix;

    // In Opera 15+, the true version is after "OPR/" 
    if ((verOffset=browser.agent.indexOf("OPR/"))!=-1) {
     browser.appname = "opera";
     browser.fullversion = browser.agent.substring(verOffset+4);
    }
    // In older Opera, the true version is after "Opera" or after "Version"
    else if ((verOffset=browser.agent.indexOf("Opera"))!=-1) {
     browser.appname = "opera";
     browser.fullversion = browser.agent.substring(verOffset+6);
     if ((verOffset=browser.agent.indexOf("Version"))!=-1) 
       browser.fullversion = browser.agent.substring(verOffset+8);
    }
    else if ((verOffset=browser.agent.indexOf("YaBrowser/"))!=-1) {
     browser.appname = "yandex";
     browser.fullversion = browser.agent.substring(verOffset+10);
    }
    // In MSIE, the true version is after "MSIE" in userAgent
    else if ((verOffset=browser.agent.indexOf("MSIE"))!=-1) {
     browser.appname = "ie";
     browser.fullversion = browser.agent.substring(verOffset+5);
    }
    // In Chrome, the true version is after "Chrome" 
    else if ((verOffset=browser.agent.indexOf("Chrome"))!=-1) {
      browser.appname = "chrome";
      if(browser.agent.indexOf("x64")!=-1)
      {
        browser.appname += "64";
      }
     browser.fullversion = browser.agent.substring(verOffset+7);
    }
    // In Safari, the true version is after "Safari" or after "Version" 
    else if ((verOffset=browser.agent.indexOf("Safari"))!=-1) {
     browser.appname = "safari";
     browser.fullversion = browser.agent.substring(verOffset+7);
     if ((verOffset=browser.agent.indexOf("Version"))!=-1) 
       browser.fullversion = browser.agent.substring(verOffset+8);
    }
    // In Firefox, the true version is after "Firefox" 
    else if ((verOffset=browser.agent.indexOf("Firefox"))!=-1) {
     browser.appname = "firefox";
     browser.fullversion = browser.agent.substring(verOffset+8);
    }
    // In most other browsers, "name/version" is at the end of userAgent 
    else if ( (nameOffset=browser.agent.lastIndexOf(' ')+1) < 
              (verOffset=browser.agent.lastIndexOf('/')) ) 
    {
     browser.appname = browser.agent.substring(nameOffset,verOffset);
     browser.fullversion = browser.agent.substring(verOffset+1);
     if (browser.appname.toLowerCase()==browser.appname.toUpperCase()) {
      browser.appname = navigator.appName;
     }
    }
    // trim the browser.fullversion string at semicolon/space if present
    if ((ix=browser.fullversion.indexOf(";"))!=-1)
       browser.fullversion=browser.fullversion.substring(0,ix);
    if ((ix=browser.fullversion.indexOf(" "))!=-1)
       browser.fullversion=browser.fullversion.substring(0,ix);

    majorVersion = parseInt(''+browser.fullversion,10);
    if (isNaN(majorVersion)) {
     browser.fullversion  = ''+parseFloat(navigator.appVersion); 
     browser.majorversion = parseInt(navigator.appVersion,10);
    }

    return browser;
}

function getChromeExtUrl() {
    return  "https://chrome.google.com/webstore/detail/360-internet-protection/glcimepnljoholdmjchkloafkggfoijh";
}

function getOperaExtUrl() {
    "https://addons.opera.com/" + getUILang().toLowerCase() + "/extensions/details/360-internet-protection";
}

function getYandexExtUrl() {
    return getOperaExtUrl();
}

function getCopyRightDesc() {
    var desc = chrome.i18n.getMessage('copy_right_desc');
    var year = new Date().getFullYear();
    return desc.replace('YEAR', year);
}

function getUILang() {
    var agent = getBrowserInfoEx().appname.toLowerCase();
    if (agent.indexOf("firefox") != -1 ) {
        var lang = chrome.i18n.getUILanguage();
        return lang.replace('_','-');
    }
    return chrome.i18n.getUILanguage();
}
