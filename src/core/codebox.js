define([
    "core/account"
], function(account) {
    var querystring = node.require("querystring");

    // Open a local box
    var open = function(project) {

    };

    // Open a remote box
    var openRemote = function(project) {
        var options = {
            'token': account.get("token")
        };

        var boxName = project.get("name");
        var boxId = project.get("boxId");
        var url = project.get("path");
        if (navigator.onLine) url = "https://codebox.io/boot/"+boxId+"?"+querystring.stringify(options);

        var win = node.gui.Window.open(url, {
            'title': [boxName, "Remote Codebox"].join('-'),
            'position': 'center',
            'width': 1024,
            'height': 768,
            'min_height': 400,
            'min_width': 400,
            'show': true,
            'toolbar': true,
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