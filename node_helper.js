const NodeHelper = require('node_helper');
const request = require('request');
const Log = require("logger");

module.exports = NodeHelper.create({
    start: function() {
        this.config = null;
        Log.info("flatastic node_helper received started!");
    },

    getShoppingList: function(callback) {
        if (this.config.shoppingListUrl) {
            this.request(this.config.shoppingListUrl, {}, callback)
        } else {
            Log.error("Can't get shoppinglist because shoppingListUrl is not defined in the configuration.");
        }
    },

    getTaskList: function(callback) {
        if (this.config.taskListUrl) {
            this.request(this.config.taskListUrl, {}, callback);
        } else {
            Log.error("Can't get taskList because taskListUrl is not defined in the configuration.");
        }
    },

    getInformation: function(callback) {
        if (this.config.infoUrl) {
            this.request(this.config.infoUrl, {}, callback);
        } else {
            Log.error("Can't get wg-information because infoUrl is not defined in the configuration.");
        }
    },
    request: function(url, option, cb) {
        const options = {
            url: url,
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "de-CH,de;q=0.9,en-US;q=0.8,en-CH;q=0.7,en;q=0.6,ar-JO;q=0.5,ar;q=0.4,de-DE;q=0.3",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-api-key": this.config.apiKey,
                "x-api-version": "2.0.0",
                "x-client-version": "2.3.20"
            }
        };

        function callback(error, response, body) {
            if (error) {
                Log.error("flatastic node_helper could not fetch " + options.url);
                Log.error("ft node_helper error: " + error);
            }
            if (!error && response.statusCode == 200) {
                const info = JSON.parse(body);
                cb(info);
            } else {
                if (response.statusCode == 401) {
                    cb("SIGNIN_ERROR");
                } else {
                    cb("LOADING_ERROR");
                }
            }
        }
        request(options, callback);
    },

    socketNotificationReceived: function(notification, payload) {
        Log.info("flatastic node_helper received command: " + notification);
        var self = this;
        if (notification === "SET_CONFIG") {
            this.config = payload;
            Log.info("Flatastic node helper received SET_CONFIG");
            this.getInformation(function(info) { self.sendSocketNotification("WG_INFO", info); });
            this.getTaskList(function(info) { self.sendSocketNotification("TASK_LIST", info); });
        }
        if (notification === "GET_TASK_LIST") {
            this.getTaskList(function(info) { self.sendSocketNotification("TASK_LIST", info); });
        }
        if (notification === "GET_WG_INFO") {
            this.getInformation(function(info) { self.sendSocketNotification("WG_INFO", info); });
        }
    },
});