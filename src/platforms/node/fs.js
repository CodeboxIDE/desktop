define([
    "hr/utils"
], function(_) {
    var fs = node.require("fs");

    return {
        isAvailable: _.constant(false),

        // Check that a path exists (sync)
        exists: fs.existsSync
    };
});