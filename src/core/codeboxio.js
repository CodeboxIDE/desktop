define([
    "platform/api"
], function(codeboxIO) {
    return function(token) {
        return new codeboxIO.Client({
            'host': "https://www.codebox.io",
            'token': token
        });
    }
});