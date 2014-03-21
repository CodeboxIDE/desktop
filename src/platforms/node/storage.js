define([
    "hr/hr",
    "hr/utils",
    "hr/promise"
], function(hr, _, Q) {
    return {
        set: function(key, value) {
            hr.Storage.set(key, value);
        },
        get: function(key, def) {
            var v = hr.Storage.get(key, def);
            if (!v) return Q.reject(new Error("No key in storage: "+key));
            return Q(v);
        }
    }
});