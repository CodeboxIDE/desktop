define([
    "hr/utils",
    "hr/hr",
    "core/codebox"
], function(_, hr, codebox) {
    var Project = hr.Model.extend({
        defaults: {
            "name": null,
            "path": null,
            "type": "local",
            "icon": "static/images/folder.png",
            "lastTimeUsed": 0
        },

        initialize: function() {
            Project.__super__.initialize.apply(this, arguments);
        },

        name: function() {
            return this.get("name") || this.get("path").split("/").pop();
        },

        open: function() {
            return codebox[this.get("type")](this);
        }
    });

    return Project;
});