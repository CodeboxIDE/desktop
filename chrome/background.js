var webview = null;


chrome.app.runtime.onLaunched.addListener(function(launchData) {
    chrome.app.window.create('index.html', {
        id:"codebox",
        bounds: {
            width: 400,
            height: 500
        },
        frame: 'chrome'
    }, function(win) {
        var resize = function() {
            var bounds = win.getBounds(), change = false;

            if (bounds.width != 400) {
                bounds.width = 400;
                change = true;
            }
            if (bounds.height < 400) {
                bounds.height = 400;
                change = true;
            }

            if (change) win.setBounds(bounds);
        }
        
        win.contentWindow.launchData = launchData;
        resize();
    });
});