/*
Android-Toast
(c) 2013-2014 Jad Joubran

https://github.com/jadjoubran/Android-Toast

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

var isReadyToPromo = false;
function checkPromoPrerequisite() {
    consoleLog("checkPromoPrerequisite");
    isReadyToPromo = true;
    chrome.runtime.sendMessage({text: Request.check_promo_prerequisite}, function(response) {
    });
}
       
function Android_Toast(request) {
    this.position = 'top';
    this.timeout_id = null;
    this.duration = 4000;
    this.text = null;
    this.status = null;
    this.textColor = null;
    this.request = null;
    
    if (!request || typeof request != 'object') {
        return false;
    } else {
        this.request = request;
    }
    
    if (request.text) {
        this.text = request.text;
    }
    if (request.duration) {
        this.duration = parseFloat(request.duration);
    }
    if (request.status) {
        this.status = request.status;
    }
    if (request.textColor) {
        this.textColor = request.textColor;
    }
    
    this.show();
}

Android_Toast.prototype.show = function() {
    consoleLog("Toast.show");
    
    if (!this.text) {
        return false;
    }
    clearTimeout(this.timeout_id);

    var body = document.getElementsByTagName('body')[0];
    if (body == undefined) {
        return false;
    }
    
    var previous_toast = document.getElementById('android_toast_container');
    if (previous_toast) {
        body.removeChild(previous_toast);
    }

    var classes = 'android_toast_fadein';
    if (this.position === 'top') {
        classes = 'android_toast_fadein android_toast_top';
    }
    
    var toast_container = document.createElement('div');
    toast_container.setAttribute('id', 'android_toast_container');
    toast_container.setAttribute('class', classes);
    body.appendChild(toast_container);
    
    var toast = document.createElement('div');
    toast.setAttribute('id', 'android_toast');
    toast.setAttribute('class', 'single_line');
    toast.innerHTML = this.text;
    if (this.status) {
        toast.setAttribute('class', 'single_line ' + this.status);
    }
    if (this.textColor) {
        toast.style.color = this.textColor;
    }
    toast_container.appendChild(toast);

    this.timeout_id = setTimeout(function(self) {
        self.hide();
    }, this.duration, this);
    
    return true;
};

Android_Toast.prototype.hide = function() {
    consoleLog("Toast.hide");

    var toast_container = document.getElementById('android_toast_container');

    if (!toast_container) {
        return false;
    }

    clearTimeout(this.timeout_id);

    toast_container.className += ' android_toast_fadeout';

    function remove_toast() {
        var toast_container = document.getElementById('android_toast_container');
        if (!toast_container) {
            return false;
        }
        toast_container.parentNode.removeChild(toast_container);
    }

    toast_container.addEventListener('webkitAnimationEnd', remove_toast);
    toast_container.addEventListener('animationEnd', remove_toast);
    toast_container.addEventListener('msAnimationEnd', remove_toast);
    toast_container.addEventListener('oAnimationEnd', remove_toast);
    
    if (this.request.event == Event.enter_shopping || this.request.event == Event.scan_end) {
        if (isStoreConsultantAvailable(this.request.pid) || isCiuvoAvailable(this.request.pid)) {
            // 1. begin after shopping/scan end
            checkPromoPrerequisite();
        }
    }
    
    return true;
};

//expose the Android_Toast object to Window
window.Android_Toast = Android_Toast;

// update toast sent from background if content script loaded(it only onMessage works when loaded)
/*
 * request: {
 *   type: 'test'/'toast'
 *   text:
 *   duration[optional]: 4s by default
 *   bkColor[optional]: green by default
 *   textColor[optional]: white by default
 * }
 */

var safety_icon = '<svg version="1.1" viewBox="0 0 18 18" style="enable-background:new 0 0 18 18;"><g><path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;" d="M9,0C4,0,0,4,0,9c0,5,4,9,9,9c5,0,9-4,9-9C18,4,14,0,9,0z M7.3,13L7.3,13L7.3,13L3.8,9.6l1.2-1.2l2.4,2.3 l5.8-5.8l1.2,1.2L7.3,13z"/></g></svg>';
var risky_icon  = '<svg version="1.1" viewBox="0 0 18 18" style="enable-background:new 0 0 18 18;"><g><path style="fill-rule:evenodd;clip-rule:evenodd;fill:#fff;" d="M9,0C4,0,0,4,0,9c0,5,4,9,9,9c5,0,9-4,9-9C18,4,14,0,9,0z M10,14H8v-2h2V14z M10,10H8V3h2V10z"/></g></svg>';

var isToastRequested = false;
var isDomLoaded = false;
var toastRequest = null;

function showToast(request) {
    getPref(Prop.enable_toast, true, function(value) {
        if (value) {
            var icon = safety_icon;
            if (request.status === 'risky') {
                icon = risky_icon;
            }
            request.text = icon + request.text;
            new Android_Toast(request);
        } else {
            if (request.event == Event.enter_shopping) {
                if (isStoreConsultantAvailable(request.pid) || isCiuvoAvailable(request.pid)) {
                    // 2. begin after shopping/scan end even though toast was disabled
                    checkPromoPrerequisite();
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function(target) {
    consoleLog("DOMContentLoaded -> isToastRequested:" + isToastRequested);
    
    isDomLoaded = true;
    
    if (isToastRequested) {
        showToast(toastRequest);
    } else {
        chrome.runtime.sendMessage({text: Request.get_product_id}, function(response) {
            if (isStoreConsultantAvailable(response) || isCiuvoAvailable(response)) {
                setTimeout(function() {
                    if (isToastRequested == false) {
                        // 3. begin after timeout(no toast request)
                        checkPromoPrerequisite();
                    }
                }, 5000);
            }
        });
    }
}, false);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    consoleLog("onMessage:" + JSON.stringify(request));
    
    if (request.type == 'test') {
        sendResponse(true);
        return;
    }
    
    if (request.type == Request.show_toast) {
        isToastRequested = true;
        toastRequest = request;
        if (isDomLoaded) {
            showToast(request);
        }
        return;
    }
    
    if (request.type == Request.promo_prerequisite_ok) { // there might be multiple request
        if (isReadyToPromo) {
            chrome.runtime.sendMessage({text: Request.inject_script, status: request.status }, function(response) {
            });
            isReadyToPromo = false;
        }
        return;
    }
});
