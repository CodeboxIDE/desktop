require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "views/projects",
    "text!resources/templates/main.html"
], function(_, $, hr, args, ProjectsView, templateFile) {
    // Configure hr
    hr.configure(args);

    hr.Resources.addNamespace("templates", {
        loader: "text"
    });

    // Define base application
    var Application = hr.Application.extend({
        name: "Codebox",
        template: templateFile,
        metas: {},
        links: {},
        events: {
            "click .toolbar .button-open": "onSelectFolder",
            "click .toolbar .button-settings": "onToggleSettings",
            "change .project-open": "onOpenFolder"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            this.projectsLocal = new ProjectsView({}, this);

            return this;
        },

        templateContext: function() {
            return {};
        },

        finish: function() {
            // Add projects
            this.projectsLocal.$el.appendTo(this.$(".projects-local"));
            this.projectsLocal.collection.loadLocal();
            if (this.projectsLocal.collection.size() == 0) this.onSelectFolder();


            return Application.__super__.finish.apply(this, arguments);
        },

        // Click to open a file
        onSelectFolder: function(e) {
            if (e) e.preventDefault();
            this.$(".project-open").click();
        },

        // Click to toggle settings
        onToggleSettings: function(e) {
            if (e) e.preventDefault();
            this.$(".settings").toggleClass("active");
        },

        // When folder selector changed
        onOpenFolder: function(e) {
            var path = $(e.currentTarget).val();
            this.projectsLocal.collection.addLocalFolder(path);
        }
    });

    var app = new Application();
    app.run();
});