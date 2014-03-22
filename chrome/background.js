
var AppWindow = function(startUrl, settings) {
    this.startUrl = startUrl;
    this.win_= null;
    this.webview = null;
    this.settings = settings;

    this.createWindow();
};

// Create a new window. Defer navigating the webview until the DOM is loaded.
AppWindow.prototype.createWindow = function() {
    chrome.app.window.create('window.html', {
        bounds: {
            width: this.settings.width,
            height: this.settings.height
        },
        frame: 'chrome'
    }, function(win) {
        this.win = win;
        this.win.contentWindow.addEventListener('DOMContentLoaded', this.onLoad.bind(this));
        this.win.onBoundsChanged.addListener(this.onBoundsChanged.bind(this));
    }.bind(this));
}

// Resize the window's webview to the window's size and load the start URL.
AppWindow.prototype.onLoad = function() {
    this.webview = this.win.contentWindow.document.getElementById('webview');
    this.webview.addEventListener('newwindow', this.onNewWindow.bind(this));

    this.onBoundsChanged();
    this.loadUrl(this.startUrl);
}

// Update this window's cached bounds and, if the window has been resized as
// opposed to just moved, also update the global app's default window size.
AppWindow.prototype.onBoundsChanged = function() {
    var bounds = this.win.getBounds(), change = false;

    if (this.settings.minWidth && bounds.width < this.settings.minWidth) {
        change = true;
        bounds.width = this.settings.minWidth;
    }
    if (this.settings.minHeight && bounds.height < this.settings.minHeight) {
        change = true;
        bounds.height = this.settings.minHeight;
    }
    if (this.settings.maxWidth && bounds.width > this.settings.maxWidth) {
        change = true;
        bounds.width = this.settings.maxWidth;
    }
    if (this.settings.maxHeight && bounds.height > this.settings.maxHeight) {
        change = true;
        bounds.height = this.settings.maxHeight;
    }

    if (change) this.win.setBounds(bounds);

    this.webview.style.height = bounds.height + 'px';
    this.webview.style.width = bounds.width + 'px';
}

// Fired when the guest page attempts to open a new browser window.
AppWindow.prototype.onNewWindow = function(e) {
    if (e.name == "popup") {
        var newwin = new AppWindow(e.targetUrl, {
            width: 1000,
            height: 600
        });
    } else {
        window.open(e.targetUrl);
    }
};

// Navigate the window's webview to an  URL.
AppWindow.prototype.loadUrl = function(url) {
    this.webview.partition = this.settings.partition || "codebox";
    this.webview.src = url;
};


chrome.app.runtime.onLaunched.addListener(function(launchData) {
    var mainWin = new AppWindow("https://www.codebox.io/app/", {
        width: 400,
        height: 500,
        maxWidth: 400,
        minWidth: 400,
        minHeight: 500
    })
});