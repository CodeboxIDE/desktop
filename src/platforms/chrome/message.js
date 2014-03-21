define([
    "hr/hr"
], function(hr) {
    var messager = new (hr.Class.extend({
        post: function(message, data) {

        }
    }));

    window.addEventListener('message', function(e) {
        console.log("get message !!");
        messager.trigger(e.data.message, e.data.data);
    });

    return messager;
})