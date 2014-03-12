define([], function(_, hr) {
    var CodeboxIO = node.require("codebox-io").Client;

    return new CodeboxIO({
        host: "http://localhost:5000"
    })
});