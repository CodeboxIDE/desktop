define([
    "hr/utils",
    "hr/hr",
    "platform/storage",
    "platform/api"
], function(_, hr, storage, codeboxIO) {

    var Account = hr.Model.extend({
        defaults: {
            "name": "",
            "email": "",
            "token": null
        },

        initialize: function() {
            Account.__super__.initialize.apply(this, arguments);
        },

        // Check if it's connected
        isConnected: function() {
            return this.get("token") != null;
        },

        // Load and save
        load: function() {
            var that = this;

            return storage.get("accounts")
            .then(function(account) {
                that.set(account)
            });
        },
        save: function() {
            storage.set("account", this.toJSON());
        },

        // Login
        login: function(email, password) {
            var that = this;

            console.log("login ", email, password);
            return codeboxIO().login(email, password)
            .then(function(account) {
                that.set({
                    name: account.name,
                    email: account.email,
                    token: account.token
                });
                that.save();
            });
        },

        // Logout
        logout: function() {
            storage.clear();
            this.clear();
            this.save();
            this.load();

        }
    });

    return Account;
});