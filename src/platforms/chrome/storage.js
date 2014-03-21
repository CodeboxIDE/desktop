define([
    "hr/utils",
    "hr/promise"
], function(_, Q) {
    return {
        set: function(key, value) {
            console.log("set storage", key);
            return;
            chrome.storage.sync.set(_.object([key], [value]), function() {});
        },
        get: function(key, def) {
            console.log("get storage", key);
            return Q.reject(new Error("No key in storage: "+key));
            var d = Q.defer();

            chrome.storage.sync.get(key, function(value) {
                if (!value || !value[key] || !def) {
                    d.reject(new Error("No key in storage: "+key));
                } else {
                    d.resolve(value[key] || def);
                }
            });

            return d.promise;
        }
    }
});