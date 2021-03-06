const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({
    start: function() {
        this.instanceConfigs = [];
        console.log("flatastic node_helper received started!");
    },

    getShoppingList: function(callback) {
        if (this.instanceConfigs[0].shoppingListUrl) {
            this.request(this.instanceConfigs[0].shoppingListUrl, {}, callback)
        } else {
            console.error("Can't get shoppinglist because shoppingListUrl is not defined in the configuration.");
        }
    },

    getTaskList: function(callback) {
        if (this.instanceConfigs[0].taskListUrl) {
            this.request(this.instanceConfigs[0].taskListUrl, {}, callback);
        } else {
            console.error("Can't get taskList because taskListUrl is not defined in the configuration.");
        }
    },

    getInformation: function(callback) {
        if (this.instanceConfigs[0].infoUrl) {
            this.request(this.instanceConfigs[0].infoUrl, {}, callback);
        } else {
            console.error("Can't get wg-information because infoUrl is not defined in the configuration.");
        }
    },

    getChores: function(callback) {
        if (this.instanceConfigs[0].choresUrl) {
            this.request(this.instanceConfigs[0].choresUrl, {}, callback);
        } else {
            console.error("Can't get chore statistics because choresUrl is not defined in the configuration.");
        }
    },

    getCashFlow: function(callback) {
        if (this.instanceConfigs[0].cashflowUrl) {
            this.request(this.instanceConfigs[0].cashflowUrl, {}, callback);
        } else {
            console.error("Can't get cashflow statistics because cashflowUrl is not defined in the configuration.");
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
                "x-api-key": this.instanceConfigs[0].apiKey,
                "x-api-version": "2.0.0",
                "x-client-version": "2.3.20"
            }
        };

        function callback(error, response, body) {
            if (error) {
                console.error("flatastic node_helper could not fetch " + options.url);
                console.error("ft node_helper error: " + error);
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

    socketNotificationReceived: function(notification, payloadObj) {
        console.log("flatastic node_helper received command: " + notification);
        var self = this;
        var payload = payloadObj.payload;
        var instanceID = payloadObj.instance;
        if (notification === "SET_CONFIG") {
            console.log("Flatastic node helper received SET_CONFIG for " + instanceID);
            payload.instanceID = instanceID;

            //Configure update timers for this instance.
            var inst = this.instanceConfigs.find(config => config.instanceID == instanceID);
            if (inst != undefined) {
                clearInterval(inst.updater);

                //Remove old config / timers
                for (var i = 0; i < this.instanceConfigs.length; i++) {
                    var obj = this.instanceConfigs[i];

                    if (obj.id == payload.instanceID) {
                        this.instanceConfigs.splice(i, 1);
                    }
                }
            }
            var self = this;
            payload.updater = setInterval(function() {
                self.updateAllData(instanceID);
            }, payload.updateInterval);
            this.instanceConfigs.push(payload);

            console.log("Set update time to " + payload.updateInterval + "ms");

            this.updateAllData(instanceID);
        }
        if (notification === "GET_TASK_LIST") {
            this.getTaskList(function(info) { self.sendToModule("TASK_LIST", info, instanceID); });
        }
        if (notification === "GET_WG_INFO") {
            this.getInformation(function(info) { self.sendToModule("WG_INFO", info, instanceID); });
        }
        if (notification === "GET_CHORES_STATS") {
            this.getChores(function(info) { self.sendToModule("CHORES_STATS", info, instanceID); });
        }
        if (notification === "GET_CASH_FLOW") {
            this.getCashFlow(function(info) { self.sendToModule("CASH_FLOW", info, instanceID); });
        }
        if (notification === "GET_SHOPPING_LIST") {
            this.getShoppingList(function(info) { self.sendToModule("SHOPPING_LIST", info, instanceID); });
        }
    },
    sendToModule: function(notif, toSend, forInstance) {
        var sendObj = { notification: notif, payload: toSend, instance: forInstance }
        this.sendSocketNotification(notif, sendObj);
    },

    //Helper functions
    updateAllData: function(instanceID) {
        var self = this;
        this.getInformation(function(info) { self.sendToModule("WG_INFO", info, instanceID); });
        this.getTaskList(function(info) { self.sendToModule("TASK_LIST", info, instanceID); });
        this.getChores(function(info) { self.sendToModule("CHORES_STATS", info, instanceID); });
        this.getCashFlow(function(info) { self.sendToModule("CASH_FLOW", info, instanceID); });
        this.getShoppingList(function(info) { self.sendToModule("SHOPPING_LIST", info, instanceID); });
    }
});