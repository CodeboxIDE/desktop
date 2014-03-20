require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "core/update",
    "core/account",
    "views/projects",
    "text!resources/templates/main.html"
], function(_, $, hr, args, update, account, ProjectsView, templateFile) {
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

            this.listenTo(this.projectsRemote, "add remove reset", function() {
                this.projectsRemote.$el.toggle(this.projectsRemote.collection.size() > 0);
            });

            this.listenTo(account, "set", this.update);

            update.isAvailable()
            .then(function(version) {
                alert("An update is available ("+version+"), download it at https://www.codebox.io");
            });

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

            var win = node.gui.Window.get();
            win.show();
            win.focus();

            return Application.__super__.finish.apply(this, arguments);
        },

        loading: function(p) {
            var that = this;
            this.$(".loading-alert").show();

            p.fin(function() {
                return Q.delay(300);
            }).fin(function() {
                that.$(".loading-alert").hide();
            });
            
            return p;
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
            var p = this.projectsLocal.collection.addLocalFolder(path);
            if (p) p.open();
        },

        // Submit form login
        onSubmitLogin: function(e) {
            if (e) e.preventDefault();

            var $btn = this.$(".form-login button");
            var email = this.$(".form-login .email").val();
            var password = this.$(".form-login .password").val();


            this.loading(account.login(email, password));
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
