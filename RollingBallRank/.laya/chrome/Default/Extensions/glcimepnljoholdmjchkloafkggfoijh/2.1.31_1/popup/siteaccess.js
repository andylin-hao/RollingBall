document.addEventListener("DOMContentLoaded", function() {
    chrome.runtime.sendMessage({text: Request.get_product_id}, function(response) {
        var message = document.getElementById('enable_message');
        message.textContent = getEnableWebProtectionDesc(response);
    });
});
