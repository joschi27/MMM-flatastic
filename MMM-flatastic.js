//flatastic.js
Module.register("MMM-flatastic", {
    // Default module config.
    result: [],
    defaults: {
        updateInterval: 1 * 10 * 1000, // every 10 minutes
        apiKey: "null",
        taskListUrl: 'https://api.flatastic-app.com/index.php/api/chores',
        shoppingListUrl: 'https://api.flatastic-app.com/index.php/api/shoppinglist',
        infoUrl: 'https://api.flatastic-app.com/index.php/api/wg',
        animationSpeed: 0,
        displayOptionalChores: true,
        maxDisplayItems: 10,
        displayStatistics: true,
        displayTaskList: true
    },

    start: function() {
        var self = this;
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification("SET_CONFIG", this.config);
        Log.info("Sent SET_CONFIG");

        fetch(this.file("res/chore-card.html"))
            .then(response => response.text())
            .then(text => self.FT_CARD = text);
        fetch(this.file("res/stats-card.html"))
            .then(response => response.text())
            .then(text => self.STATS_CARD = text);

        this.scheduleUpdate(this.config.updateInterval);
    },

    scheduleUpdate: function(delay) {
        var self = this;
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) { nextLoad = delay; }
        setTimeout(function() { self.updateInfo(); }, nextLoad);
    },

    updateInfo: function() {
        this.sendSocketNotification("GET_WG_INFO", this.config);
        this.sendSocketNotification("GET_TASK_LIST", this.config);
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.allDataLoaded()) {
            wrapper.innerHTML = this.translate("LOADING");
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        if (this.errorText) {
            wrapper.innerHTML = "<p>" + this.errorText + "</p>";
            return wrapper;
        }
        if (this.config.displayStatistics) {
            var stats = "<div>";
            stats += "<h3>Rangliste</h3>";
            var c = 0;
            for (const user of this.wgInfo.flatmates) {
                var card = JSON.parse(JSON.stringify(this.STATS_CARD));
                card = card.replaceAll("{{%PLACE%}}", c++);
                card = card.replaceAll("{{%USER_NAME%}}", user.firstName);
                card = card.replaceAll("{{%POINTS%}}", user.chorePoints);
                stats += card;
            }
            stats += "</div>"
            wrapper.innerHTML += stats;
        }
        if (this.config.displayTaskList) {
            var taskCard = "";
            taskCard += '<div class="ft-grid" style="max-height: ' + 500 + 'px; max-width: ' + 500 + 'px">';
            this.taskList.sort((a, b) => a.timeLeftNext - b.timeLeftNext);
            var curr = 0;
            for (const element of this.taskList) {
                if (element.rotationTime == -1 && !this.config.displayOptionalChores) {
                    continue;
                }
                curr++;
                if (curr > this.config.maxDisplayItems) {
                    var moreCard = '<div class="ft-card">' +
                        '<div class="ft-card-chore-title">' +
                        '<span class="default">' + "& " + (this.taskList.length - this.config.maxDisplayItems) + ' Weitere...' + '</span>' +
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

        //wrapper.innerHTML = "<p>" + this.wgInfo + "</p>";
        return wrapper;
    },

    getStyles: function() {
        return [this.file("res/ft.css")];
    },

    socketNotificationReceived: function(notification, payload) {
        Log.log(this.name + " received a socket notification: " + notification);
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
        this.errorText = undefined;
        this.updateDom(this.config.animationSpeed);
    },


    //Helper functions
    getUserById: function(id) {
        return this.wgInfo.flatmates.find(user => user.id == id);
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
    }
});