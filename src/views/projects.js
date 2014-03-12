define([
    "hr/utils",
    "hr/hr",
    "core/codebox",
    "collections/projects",
    "text!resources/templates/project.html"
], function(_, hr, codebox, Projects, templateFile) {
    var ProjectItem = hr.List.Item.extend({
        className: "project",
        template: templateFile,
        events: {
            'click': "open"
        },

        templateContext: function() {
            return {
                'project': this.model
            };
        },
        open: function(e) {
            if (e) e.preventDefault();
            codebox[this.model.get("type")](this.model);
        }
    });

    var ProjectsView = hr.List.extend({
        className: "projects",
        Collection: Projects,
        Item: ProjectItem
    });

    return ProjectsView;
});