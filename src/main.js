require([
    "hr/utils",
    "hr/dom",
    "hr/hr",
    "hr/args",
    "platform/infos",
    "platform/update",
    "core/account",
    "core/stacks",
    "views/projects",
    "text!resources/templates/main.html"
], function(_, $, hr, args, platform, update, account, stacks, ProjectsView, templateFile) {
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
            // Dialog
            "click *[data-toggle-dialog]": "onToggleDialog",

            // Toolbar buttons
            "click .toolbar .button-open": "onSelectFolder",

            // Files selection
            "change .project-open": "onOpenFolder",

            // Forms
            "submit .form-login": "onSubmitLogin",
            "submit .form-create": "onSubmitCreate",
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

            if (platform.allowOpenLocal) {
                this.listenTo(this.projectsRemote, "add remove reset", function() {
                    this.projectsRemote.$el.toggle(this.projectsRemote.collection.size() > 0);
                }); 
            }

            this.listenTo(account, "set", this.update);

            update.isAvailable()
            .then(function(version) {
                alert("An update is available ("+version+"), download it at https://www.codebox.io");
            });

            return this;
        },

        templateContext: function() {
            return {
                'account': account,
                'platform': platform,
                'stacks': stacks
            };
        },

        render: function() {
            account.load();

            return Application.__super__.render.apply(this, arguments);
        },

        finish: function() {
            // Add local projects list
            if (platform.allowOpenLocal) {
                this.projectsLocal.$el.appendTo(this.$(".projects-local"));
                this.projectsLocal.collection.load();
            }

            // Add remote boxes list
            if (account.isConnected()) {
                this.projectsRemote.$el.appendTo(this.$(".projects-remote"));
                this.projectsRemote.collection.loadRemote();
            }

            if (platform.allowOpenLocal) {
                if (this.projectsLocal.collection.size() == 0 && !account.isConnected()) this.onSelectFolder();
            } else {
                if (!account.isConnected()) this.toggleDialog("settings", true);
            }
            
            platform.ready();

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

        // Toggle a dialog
        toggleDialog: function(name, st) {
            this.$(".dialog:not(.dialog-"+name+")").removeClass("active");
            this.$(".dialog-"+name).toggleClass("active", st);
        },

        // Alert
        alert: function(type, message) {
            this.$(".dialog-alert .content").text(message.message || message);
            this.$(".dialog-alert").attr("class", "dialog dialog-alert type-"+type);
            this.toggleDialog("alert");
        },

        // Click to open a file
        onSelectFolder: function(e) {
            if (e) e.preventDefault();
            this.$(".project-open").click();
        },

        // Click to toggle settings
        onToggleDialog: function(e) {
            if (e) e.preventDefault();
            this.toggleDialog($(e.currentTarget).data("toggle-dialog"));
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

            var that = this;
            var email = this.$(".form-login .email").val();
            var password = this.$(".form-login .password").val();


            this.loading(account.login(email, password))
            .then(function() {
                that.toggleDialog("settings", false);
            }, _.partial(this.alert, "error").bind(this));
        },

        // Submit form create
        onSubmitCreate: function(e) {
            if (e) e.preventDefault();

            var that = this;
            var name = this.$(".form-create .name").val();
            var stack = this.$(".form-create .stack").val();

            this.loading(this.projectsRemote.collection.createRemote(name, stack))
            .then(function() {
                that.toggleDialog("create", false);
            }, _.partial(this.alert, "error").bind(this));
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
