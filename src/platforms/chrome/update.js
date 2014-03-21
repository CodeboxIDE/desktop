define([
    "hr/promise"
], function(Q) {
    var isAvailable = function() {
        return Q.reject(new Error("No new version available"));
    };

    return {
        isAvailable: isAvailable
    };
});