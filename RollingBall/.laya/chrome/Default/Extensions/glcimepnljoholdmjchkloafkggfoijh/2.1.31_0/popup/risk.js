document.addEventListener("DOMContentLoaded", function() {
    closeButton = document.getElementById('close-tab');
    closeButton.textContent = chrome.i18n.getMessage('close');
    closeButton.addEventListener('click', function(e) {
        window.close();
    });
    
    reportText = document.getElementById('report-false-positive');
    reportText.addEventListener('click', function(e) {
        window.close();
    });
});
