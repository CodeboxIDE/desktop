define([
    "hr/utils",
    "hr/hr",
    "models/project",
    "core/account",
    "core/codeboxio"
], function(_, hr, Project, account, codeboxIO) {
    var fs = node.require("fs");

    var Projects = hr.Collection.extend({
        model: Project,

        // Sort comparator
        comparator: function(command) {
            return command.get("lastTimeUsed", 0);
        },

        // Valid a project
        valid: function(project) {
            if (project.get("type") == "local") {
                return project.get("path") && fs.existsSync(project.get("path"));
            }
            return true;
        },

        // Save and load
        save: function() {
            hr.Storage.set(this.options.namespace, this.toJSON());
        },
        load: function() {
            var that = this;
            this.reset(
                _.chain(hr.Storage.get(this.options.namespace, []))
                .map(function(data) {
                    if (_.isObject(data)) return new Project({}, data);
                    return null;
                })
                .filter(function(project) {
                    if (!project) return false;
                    return that.valid(project);
                })
                .value()
            );
        },

        // Add a local folder
        addLocalFolder: function(path) {
            var p = new Project({}, {
                'path': path,
                'lastTimeUsed': Date.now()
            });

            if (!this.valid(p)) return;

            this.add(p);
            this.save();
        },


        // Load remote box
        loadRemote: function() {
            var that = this, client;

            that.load();

            client = codeboxIO(account.get("token"));
            return client.boxes()
            .then(function(boxes) {
                that.reset(
                    _.chain(boxes)

                    // Map project
                    .map(function(box) {
                        return {
                            'name': box.name,
                            'path': client.config.host,
                            'lastTimeUsed': box.lastHourPaid*1000,
                            'type': "remote",
                            'icon': "static/images/icons/128.png",
                            'boxId': box.id
                        }
                    })
                    .value()
                );
                that.save();
            });
        }
    });

    return Projects;
});