define([], function() {
    return function(token) {
        return new window.codeboxIO.Client({
            'host': window.location.protocol+"//"+window.location.host,
            'token': token
        });
    }
});