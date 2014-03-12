define([
    "hr/utils",
    "hr/hr",
    "collections/projects",
    "text!resources/templates/project.html"
], function(_, hr, Projects, templateFile) {
    var ProjectItem = hr.List.Item.extend({
        className: "project",
        template: templateFile,

        templateContext: function() {
            return {
                'project': this.model
            };
        }
    });

    var ProjectsView = hr.List.extend({
        className: "projects",
        Collection: Projects,
        Item: ProjectItem
    });

    return ProjectsView;
});