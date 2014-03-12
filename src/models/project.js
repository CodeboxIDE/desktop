define([
    "hr/utils",
    "hr/hr"
], function(_, hr) {
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
        }
    });

    return Project;
});