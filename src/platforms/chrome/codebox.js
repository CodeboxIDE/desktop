define([
    "core/account"
], function(account) {
    // Open a local box
    var open = function(project) {
        return null;
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

        return window.open(url, "popup");
    };

    return {
        'local': open,
        'remote': openRemote
    };
});