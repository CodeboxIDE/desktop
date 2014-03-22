define([
    "core/account"
], function(account) {
    // Open a local box
    var open = function(project) {
        var _path = project.get("path");
        var encodedPath = encodeURIComponent(_path);
        var env = encodeURIComponent(JSON.stringify(process.env));
        var win = node.gui.Window.open("../src/platforms/node/ide.html?path="+encodedPath+"&env="+env, {
            'title': [project.name(),  "Codebox"].join('-'),
            'position': 'center',
            'width': 1024,
            'height': 768,
            'min_height': 400,
            'min_width': 400,
            'show': false,
            'toolbar': false,
            'frame': true,
            'new-instance': true    // Because new isntance, we can't access the win object
        });
        win.maximize();
    };

    // Open a remote box
    var openRemote = function(project) {
        var options = {
            'token': account.get("token")
        };

        var boxName = project.get("name");
        var boxId = project.get("boxId");
        var url = project.get("path");
        if (navigator.onLine) url = "https://www.codebox.io/boot/"+boxId+"?"+$.param(options);

        var win = node.gui.Window.open(url, {
            'title': [boxName, "Remote Codebox"].join('-'),
            'position': 'center',
            'width': 1024,
            'height': 768,
            'min_height': 400,
            'min_width': 400,
            'show': true,
            'toolbar': false,
            'frame': true,
            'nodejs': false,
            'new-instance': false
        });
        win.maximize();
        return win;
    };

    return {
        'local': open,
        'remote': openRemote
    };
});