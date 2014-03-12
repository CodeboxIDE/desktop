define([
    "hr/utils",
    "hr/hr",
    "core/codeboxio"
], function(_, hr, codeboxIO) {

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
            this.set(hr.Storage.get("account"));
        },
        save: function() {
            hr.Storage.set("account", this.toJSON());
        },

        // Login
        login: function(email, password) {
            var that = this;

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
            this.clear();
            this.save();
            this.load();
        }
    });

    return Account;
});