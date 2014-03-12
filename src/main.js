require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "core/account",
    "views/projects",
    "text!resources/templates/main.html"
], function(_, $, hr, args, account, ProjectsView, templateFile) {
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
            // Toolbar buttons
            "click .toolbar .button-open": "onSelectFolder",
            "click .toolbar .button-settings": "onToggleSettings",

            // Files selection
            "change .project-open": "onOpenFolder",

            // Forms
            "submit .form-login": "onSubmitLogin",
            "submit .form-logout": "onSubmitLogout"
        },

        initialize: function() {
            Application.__super__.initialize.apply(this, arguments);

            this.projectsLocal = new ProjectsView({
                collection: {
                    namespace: "projects"
                }
            }, this);
            this.projectsRemote = new ProjectsView({
                collection: {
                    namespace: "remotes"
                }
            }, this);

            this.listenTo(account, "set", this.update);

            return this;
        },

        templateContext: function() {
            return {
                'account': account
            };
        },

        render: function() {
            account.load();

            return Application.__super__.render.apply(this, arguments);
        },

        finish: function() {
            // Add projects
            this.projectsLocal.$el.appendTo(this.$(".projects-local"));
            this.projectsLocal.collection.load();

            // Add remote boxes
            if (account.isConnected()) {
                this.projectsRemote.$el.appendTo(this.$(".projects-remote"));
                this.projectsRemote.collection.loadRemote();
            }

            if (this.projectsLocal.collection.size() == 0 && !account.isConnected()) this.onSelectFolder();


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
        },

        // Submit form login
        onSubmitLogin: function(e) {
            if (e) e.preventDefault();

            var email = this.$(".form-login .email").val();
            var password = this.$(".form-login .password").val();

            account.login(email, password);
        },

        // Submit form logout
        onSubmitLogout: function(e) {
            if (e) e.preventDefault();

            account.logout();
        }
    });

    var app = new Application();
    app.run();
});