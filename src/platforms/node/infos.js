define(function() {
    return {
        name: "Node",

        // Remote and lcoal boxes on desktop
        allowOpenLocal: true,

        // When app is ready
        ready: function() {
            var win = node.gui.Window.get();
            win.show();
            win.focus();
        }
    };
});