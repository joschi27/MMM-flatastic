//flatastic.js
Module.register("MMM-flatastic", {
    // Default module config.
    result: [],
    defaults: {
        updateInterval: 10 * 1000, //Miliseconds
        apiKey: "null",
        taskListUrl: 'https://api.flatastic-app.com/index.php/api/chores',
        shoppingListUrl: 'https://api.flatastic-app.com/index.php/api/shoppinglist',
        infoUrl: 'https://api.flatastic-app.com/index.php/api/wg',
        choresUrl: 'https://api.flatastic-app.com/index.php/api/chores/statistics',
        cashflowUrl: 'https://api.flatastic-app.com/index.php/api/cashflow/statistics',
        animationSpeed: 0,
        taskListConfig: { show: true, maxDisplayItems: 10, showOptionalChores: true },
        statisticsConfig: { show: true, showMoney: true, showChorePoints: true },
        displayShoppingList: false,
    },

    start: function() {
        var self = this;
        Log.info("Starting module: " + this.name);
        this.config.instanceID = this.identifier;

        var number = this.identifier.substring(7, 8);

        var self = this;
        //Set a timeout so the upper most module sets the config first.
        setTimeout(function() {
            self.sendToNodeHelper("SET_CONFIG", self.config);
        }, number * 100);

        fetch(this.file("res/chore-card.html"))
            .then(response => response.text())
            .then(text => self.FT_CARD = text);
        fetch(this.file("res/stats-card.html"))
            .then(response => response.text())
            .then(text => self.STATS_CARD = text);
        fetch(this.file("res/shopping-card.html"))
            .then(response => response.text())
            .then(text => self.SHOPPING_CARD = text);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.classList.add("container");

        if (!this.allDataLoaded()) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.errorText) {
            wrapper.innerHTML = "<p>" + this.errorText + "</p>";
            return wrapper;
        }

        if (this.config.displayShoppingist) {
            var shop = "<div>";
            shop += "not implemented yet! Coming soon.</div>";
        }

        if (this.config.statisticsConfig.show) {
            var statGrid = '<div class="ft-grid">';
            Log.info("added ft-grid");
            var c = 0;
            var users = JSON.parse(JSON.stringify(this.wgInfo.flatmates));

            //Set the actual chore points from the chore stats api, because the chore points in the flatmates user object is wrong.
            users.forEach(user => user.actualPoints = this.getChoresByUserId(user.id));
            users.forEach(user => user.balance = this.getCashFlowByUserId(user.id).balance);
            users.sort((a, b) => { a.actualPoints - b.actualPoints }).reverse();
            for (const user of users) {
                var card = JSON.parse(JSON.stringify(this.STATS_CARD));
                card = card.replaceAll("{{%PLACE%}}", ++c);
                card = card.replaceAll("{{%USER_NAME%}}", user.firstName);
                if (this.config.statisticsConfig.showChorePoints) {
                    card = card.replaceAll("{{%POINTS%}}", user.actualPoints);
                    card = card.replaceAll("{{%HIDE_CHORE%}}", "");
                } else {
                    card = card.replaceAll("{{%POINTS%}}", "");
                    card = card.replaceAll("{{%HIDE_CHORE%}}", "hidden");
                }
                card = card.replaceAll("{{%USER_IMAGE_URL%}}", user.profileImage);
                if (this.config.statisticsConfig.showMoney) {
                    card = card.replaceAll("{{%USER_CASH_VALUE%}}", (Math.round(user.balance * 100) / 100));
                    card = card.replaceAll("{{%USER_CASH_CURRENCY%}}", this.wgInfo.currency);
                    card = card.replaceAll("{{%HIDE_CASH%}}", "");
                } else {
                    card = card.replaceAll("{{%HIDE_CASH%}}", "hidden");
                }
                card = card.replaceAll("{{%GOOD_BAD_CLASS%}}", user.balance >= 0 ? "profit" : "debt");
                statGrid += card;
                Log.info("Added card");
            }
            Log.info("Added grid-end");
            statGrid += "</div>";
            wrapper.innerHTML += statGrid;
        }
        if (this.config.taskListConfig.show) {
            var taskCard = "";
            taskCard += '<div class="ft-grid">';
            this.taskList.sort((a, b) => a.timeLeftNext - b.timeLeftNext);
            var curr = 0;
            for (const element of this.taskList) {
                if (element.rotationTime == -1 && !this.config.taskListConfig.showOptionalChores) {
                    continue;
                }
                curr++;
                if (curr > this.config.taskListConfig.maxDisplayItems) {
                    var moreCard = '<div class="ft-card" style="text-align:left">' +
                        '<div class="ft-card-chore-title">' +
                        '<span class="default">' + "& " + (this.taskList.length - this.config.taskListConfig.maxDisplayItems) + ' Weitere...' + '</span>' +
                        '</div>' +
                        '</div>';
                    taskCard += moreCard;
                    break;
                }
                var card = JSON.parse(JSON.stringify(this.FT_CARD));
                var user = this.getUserById(element.currentUser);
                card = card.replaceAll("{{%FLATMATE_NAME%}}", user.firstName);
                if (element.rotationTime == -1) {
                    card = card.replaceAll("{{%DATE%}}", "Bei Bedarf");
                    card = card.replaceAll("{{%REPEATING_INFO%}}", this.unixToLastDone(element.lastDoneDate));
                } else {
                    card = card.replaceAll("{{%DATE%}}", this.unixToDueTime(element.timeLeftNext));
                    card = card.replaceAll("{{%REPEATING_INFO%}}", this.unixToRepetition(element.rotationTime))
                    if (this.unixToDays(element.timeLeftNext) > 0) {
                        card = card.replaceAll("{{%GOOD_BAD_CLASS%}}", "profit");
                    } else if (this.unixToDays(element.timeLeftNext) < 0) {
                        card = card.replaceAll("{{%GOOD_BAD_CLASS%}}", "debt");
                    }
                }
                card = card.replaceAll("{{%CHORE_NAME%}}", element.title);
                card = card.replaceAll("{{%GOOD_BAD_CLASS%}}", "default");
                taskCard += card;
            }
            taskCard += "</div>";
            wrapper.innerHTML += taskCard;
        }

        return wrapper;
    },

    getStyles: function() {
        return [this.file("res/ft.css")];
    },

    socketNotificationReceived: function(notification, payloadObj) {
        Log.log(this.name + " received a socket notification: " + notification);
        var instanceID = payloadObj.instance;
        if (instanceID != this.config.instanceID) {
            //We only want notifications ment for our own module instance.
            return;
        }
        var payload = payloadObj.payload;
        if (payload === "LOADING_ERROR") {
            Log.error("flatastic could not fetch " + notification);
            this.errorText = this.translate("LOADING_ERROR");
            this.updateDom(this.config.animationSpeed);
            return;
        }
        if (payload === "SIGNIN_ERROR") {
            Log.error("flatastic could not fetch " + notification + "logon error");
            this.errorText = this.translate("SIGNIN_ERROR");
            this.updateDom(this.config.animationSpeed);
            return;
        }

        if (notification === "WG_INFO") {
            this.wgInfo = payload;
            Log.info(this.wgInfo);
        }
        if (notification === "TASK_LIST") {
            this.taskList = payload;
            Log.info(this.taskList);
        }
        if (notification === "CHORES_STATS") {
            this.choresStats = payload;
            Log.info(this.choresStats);
        }
        if (notification === "CASH_FLOW") {
            this.cashFlowStats = payload;
            Log.info(this.cashFlowStats);
        }
        if (notification === "SHOPPING_LIST") {
            this.shoppingList = payload;
            Log.info(this.shoppingList);
        }

        this.errorText = undefined;
        this.updateDom(this.config.animationSpeed);
    },


    //Helper functions
    getUserById: function(id) {
        return this.wgInfo.flatmates.find(user => user.id == id);
    },
    getChoresByUserId: function(id) {
        return this.choresStats.chore[id];
    },
    getCashFlowByUserId: function(id) {
        return this.cashFlowStats.find(user => user.id == id);
    },
    allDataLoaded: function() {
        return this.wgInfo && this.taskList && this.FT_CARD && this.STATS_CARD;
    },
    unixToLastDone: function(unixLastDoneDate) {
        var text = "🗓 Zuletzt Erledigt: ";
        var days = unixLastDoneDate - new Date().getTime() / 1000;
        days = this.unixToDays(days);
        days = Math.abs(days);
        if (days == 0) return text + "Heute";
        if (days == 1) return text + "Gestern";
        return text + "vor " + days + " Tagen";
    },
    unixToRepetition: function(unixRange) {
        var text = "⟳";
        var days = this.unixToDays(unixRange);
        if (days == 1) return text + " Täglich";
        if (days == 2) return text + " Alle zwei Tage";
        if (days == 3) return text + " Alle drei Tage";
        if (days == 4) return text + " Alle vier Tage";
        if (days == 5) return text + " Alle fünf Tage";
        if (days == 6) return text + " Alle sechs Tage";
        if (days == 7) return text + " Wöchentlich";
        if (days == 365) return text + " Jährlich";
        if (days % 7 == 0) { return text + " Alle " + days / 7 + " Wochen" }
        return text + " Alle " + days;
    },
    unixToDueTime: function(unixRange) {
        var text = "";
        var days = this.unixToDays(unixRange);
        var single = Math.abs(days) == 1;
        if (days < 0) {
            text = single ? " Tag Verzug" : " Tage Verzug";
            return Math.abs(days) + text;
        } else if (days > 0) {
            text = single ? " Tag" : " Tagen";
            return "In " + Math.abs(days) + text;
        } else {
            return "Heute fällig";
        }
    },
    unixToDays: function(unixRange) {
        var days = unixRange / 60 / 60 / 24;
        days = Math.round(days);
        return days;
    },
    sendToNodeHelper: function(notif, toSend) {
        var sendObj = { notification: notif, payload: toSend, instance: this.config.instanceID }
        this.sendSocketNotification("SET_CONFIG", sendObj);
    }
});