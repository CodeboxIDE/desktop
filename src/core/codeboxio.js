define([], function(_, hr) {
    var CodeboxIO = node.require("codebox-io").Client;

    return function(token) {
        return new CodeboxIO({
            'host': "https://www.codebox.io",
            'token': token
        });
    }
});