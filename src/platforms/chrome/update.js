define([
    "hr/hr",
    "hr/promise"
], function(hr, Q) {
    var isAvailable = function() {
        return Q.reject(new Error("No new version available"));
    };

    hr.Offline.on("update", function() {
        location.reload();
    });
    hr.Offline.checkUpdate();

    return {
        isAvailable: isAvailable
    };
});