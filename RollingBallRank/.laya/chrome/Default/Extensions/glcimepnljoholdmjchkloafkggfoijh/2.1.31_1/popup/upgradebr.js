document.addEventListener("DOMContentLoaded", function() {
    var message = document.getElementById('upgrade_br_message');
    message.textContent = chrome.i18n.getMessage('upgrade_browser_message');
});
