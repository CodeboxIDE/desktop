define([
    "hr/utils",
    "hr/hr",
    "models/project",
    "platform/fs",
    "core/account",
], function(_, hr, Project, fs, account) {
    var Projects = hr.Collection.extend({
        model: Project,

        // Sort comparator
        comparator: function(command) {
            return command.get("lastTimeUsed", 0);
        },

        // Valid a project
        valid: function(project) {
            if (project.get("type") == "local") {
                return project.get("path") && fs.exists(project.get("path"));
            }
            return true;
        },

        // Save and load
        save: function() {
            hr.Storage.set(this.options.namespace, this.toJSON());
        },
        load: function() {
            var that = this;
            that.reset(
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

            return p;
        },


        // Load remote box
        loadRemote: function() {
            var that = this;

            that.load();
            return account.client().boxes()
            .then(function(boxes) {
                that.reset(
                    _.chain(boxes)

                    // Map project
                    .map(function(box) {
                        return {
                            'name': box.name,
                            'path': box.url,
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
        },

        // Create a new remote box
        createRemote: function(name, stack) {
            var that = this;

            return account.client().create({
                'name': name,
                'stack': stack
            })
            .then(function(box) {
                console.log(box);
                return that.loadRemote();
            });
        }
    });

    return Projects;
});