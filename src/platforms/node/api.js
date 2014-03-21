define(function() {
    var codeboxIO = node.require("codebox-io");

    return function(token) {
        return new codeboxIO.Client({
            'host': "https://www.codebox.io",
            'token': token
        });
    }
});