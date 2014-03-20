chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('index.html', {
        id:"codebox",
        bounds: {
            width: 400,
            height: 500
        }
    }, function(win) {
        win.contentWindow.launchData = launchData;
    });
});