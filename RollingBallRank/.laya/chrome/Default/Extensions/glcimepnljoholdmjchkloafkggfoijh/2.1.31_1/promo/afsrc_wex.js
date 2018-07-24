(function() {
    com.ciuvo.asdetector = new com.ciuvo.ASDetector();

    function onSendHeaders(details) {
        if (details.type === 'main_frame') {
            com.ciuvo.asdetector.onNavigationEvent(details.tabId,
                    details.url, details.requestId, details.timeStamp);
        }
    };

    chrome.webRequest.onSendHeaders.addListener(onSendHeaders, {
        urls : [ 'http://*/*', 'https://*/*' ]
    }, [ 'requestHeaders' ]);
})();

com.ciuvo.hostname_from_url = function(url) {
    return new URL(url).hostname;
}

com.ciuvo.get_afsrc_threshold = function() {
    return 800;
}
