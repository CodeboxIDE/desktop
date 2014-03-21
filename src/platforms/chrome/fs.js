define([
    "hr/utils"
], function(_) {

    return {
        isAvailable: _.constant(false),

        // Check that a path exists (sync)
        exists: _.constant(false)
    };
});