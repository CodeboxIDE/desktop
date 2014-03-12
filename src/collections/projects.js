define([
    "hr/utils",
    "hr/hr",
    "models/project"
], function(_, hr, Project) {
    var fs = node.require("fs")

    var Projects = hr.Collection.extend({
        model: Project,

        // Sort comparator
        comparator: function(command) {
            return command.get("lastTimeUsed", 0);
        },

        // Load from localstorage
        loadLocal: function() {
            var projects = hr.Storage.get("projects", []);
            this.reset(
                _.chain(projects)

                // Filter invalid projects
                .filter(function(project) {
                    if (!project.path || !project.lastTimeUsed) return false;

                    return fs.existsSync(project.path);
                })

                // Map project
                .map(function(project) {
                    return {
                        'name': project.path.split("/").pop(),
                        'path': project.path,
                        'lastTimeUsed': project.lastTimeUsed
                    }
                })
                .value()
            )
        },

        // Save to local
        saveLocal: function() {
            hr.Storage.set("projects", this.map(function(project) {
                return {
                    'path': project.get("path"),
                    'lastTimeUsed': project.get("lastTimeUsed")
                };
            }));
        },

        // Add a local folder
        addLocalFolder: function(path) {
            this.add({
                'name': path.split("/").pop(),
                'path': path,
                'lastTimeUsed': Date.now()
            });
            this.saveLocal();
        }
    });

    return Projects;
});