//flatastic.js
Module.register("MMM-flatastic", {
    // Default module config.
    result: [],
    defaults: {
        updateInterval: 60 * 1000, //Miliseconds
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
        language: 'de',
    },

    getTranslations: function(languageCode) {
        switch (languageCode) {
            case 'de':
                return {
                    DAILY: 'Täglich',
                    DUE_IN_DAY: 'In %d Tag',
                    DUE_IN_DAYS: 'In %d Tagen',
                    DUE_TODAY: 'Heute fällig',
                    EVERY_TWO_DAYS: 'Alle 2 Tage',
                    EVERY_THREE_DAYS: 'Alle 3 Tage',
                    EVERY_FOUR_DAYS: 'Alle 4 Tage',
                    EVERY_FIVE_DAYS: 'Alle 5 Tage',
                    EVERY_SIX_DAYS: 'Alle 6 Tage',
                    EVERY_X_DAYS: 'Alle %d Tage',
                    EVERY_X_WEEKS: 'Alle %d Wochen',
                    LAST_DONE_DAYS_AGO: 'vor %d Tagen',
                    LAST_DONE_PREFIX: '🗓 Zuletzt Erledigt: ',
                    LAST_DONE_TODAY: 'Heute',
                    LAST_DONE_YESTERDAY: 'Gestern',
                    LOADING: 'Lade...',
                    LOADING_ERROR: 'Konnte Daten von flatastic nicht laden',
                    MORE_TASKS: '& %d Weitere...',
                    ON_DEMAND: 'Bei Bedarf',
                    OVERDUE_DAY: '%d Tag Verzug',
                    OVERDUE_DAYS: '%d Tage Verzug',
                    SIGNIN_ERROR: 'Konnte nicht bei flatastic anmelden',
                    WEEKLY: 'Wöchentlich',
                    YEARLY: 'Jährlich'
                };
            case 'en':
                return {
                    DAILY: 'Daily',
                    DUE_IN_DAY: 'In %d day',
                    DUE_IN_DAYS: 'In %d days',
                    DUE_TODAY: 'Due today',
                    EVERY_TWO_DAYS: 'Every other day',
                    EVERY_THREE_DAYS: 'Every 3 days',
                    EVERY_FOUR_DAYS: 'Every 4 days',
                    EVERY_FIVE_DAYS: 'Every 5 days',
                    EVERY_SIX_DAYS: 'Every 6 days',
                    EVERY_X_DAYS: 'Every %d days',
                    EVERY_X_WEEKS: 'Every %d weeks',
                    LAST_DONE_DAYS_AGO: '%d days ago',
                    LAST_DONE_PREFIX: '🗓 Last done: ',
                    LAST_DONE_TODAY: 'Today',
                    LAST_DONE_YESTERDAY: 'Yesterday',
                    LOADING: 'Loading...',
                    LOADING_ERROR: 'Could not fetch data from Flatastic',
                    MORE_TASKS: '& %d more...',
                    ON_DEMAND: 'As needed',
                    OVERDUE_DAY: '%d day overdue',
                    OVERDUE_DAYS: '%d days overdue',
                    SIGNIN_ERROR: 'Could not sign in to Flatastic',
                    WEEKLY: 'Weekly',
                    YEARLY: 'Yearly'
                };
            case 'es':
                return {
                    DAILY: 'Diario',
                    DUE_IN_DAY: 'En %d día',
                    DUE_IN_DAYS: 'En %d días',
                    DUE_TODAY: 'Vence hoy',
                    EVERY_TWO_DAYS: 'Cada 2 días',
                    EVERY_THREE_DAYS: 'Cada 3 días',
                    EVERY_FOUR_DAYS: 'Cada 4 días',
                    EVERY_FIVE_DAYS: 'Cada 5 días',
                    EVERY_SIX_DAYS: 'Cada 6 días',
                    EVERY_X_DAYS: 'Cada %d días',
                    EVERY_X_WEEKS: 'Cada %d semanas',
                    LAST_DONE_DAYS_AGO: 'hace %d días',
                    LAST_DONE_PREFIX: '🗓 Última vez: ',
                    LAST_DONE_TODAY: 'Hoy',
                    LAST_DONE_YESTERDAY: 'Ayer',
                    LOADING: 'Cargando...',
                    LOADING_ERROR: 'No se pudieron obtener datos de Flatastic',
                    MORE_TASKS: 'y %d más...',
                    ON_DEMAND: 'Cuando sea necesario',
                    OVERDUE_DAY: '%d día de retraso',
                    OVERDUE_DAYS: '%d días de retraso',
                    SIGNIN_ERROR: 'No se pudo iniciar sesión en Flatastic',
                    WEEKLY: 'Semanal',
                    YEARLY: 'Anual'
                };
            case 'fr':
                return {
                    DAILY: 'Quotidien',
                    DUE_IN_DAY: 'Dans %d jour',
                    DUE_IN_DAYS: 'Dans %d jours',
                    DUE_TODAY: "À faire aujourd'hui",
                    EVERY_TWO_DAYS: 'Tous les 2 jours',
                    EVERY_THREE_DAYS: 'Tous les 3 jours',
                    EVERY_FOUR_DAYS: 'Tous les 4 jours',
                    EVERY_FIVE_DAYS: 'Tous les 5 jours',
                    EVERY_SIX_DAYS: 'Tous les 6 jours',
                    EVERY_X_DAYS: 'Tous les %d jours',
                    EVERY_X_WEEKS: 'Toutes les %d semaines',
                    LAST_DONE_DAYS_AGO: 'il y a %d jours',
                    LAST_DONE_PREFIX: '🗓 Dernière fois : ',
                    LAST_DONE_TODAY: "Aujourd'hui",
                    LAST_DONE_YESTERDAY: 'Hier',
                    LOADING: 'Chargement...',
                    LOADING_ERROR: 'Impossible de récupérer les données de Flatastic',
                    MORE_TASKS: 'et %d de plus...',
                    ON_DEMAND: 'Si nécessaire',
                    OVERDUE_DAY: '%d jour de retard',
                    OVERDUE_DAYS: '%d jours de retard',
                    SIGNIN_ERROR: 'Impossible de se connecter à Flatastic',
                    WEEKLY: 'Hebdomadaire',
                    YEARLY: 'Annuel'
                };
            case 'it':
                return {
                    DAILY: 'Giornaliero',
                    DUE_IN_DAY: 'Tra %d giorno',
                    DUE_IN_DAYS: 'Tra %d giorni',
                    DUE_TODAY: 'Scade oggi',
                    EVERY_TWO_DAYS: 'Ogni 2 giorni',
                    EVERY_THREE_DAYS: 'Ogni 3 giorni',
                    EVERY_FOUR_DAYS: 'Ogni 4 giorni',
                    EVERY_FIVE_DAYS: 'Ogni 5 giorni',
                    EVERY_SIX_DAYS: 'Ogni 6 giorni',
                    EVERY_X_DAYS: 'Ogni %d giorni',
                    EVERY_X_WEEKS: 'Ogni %d settimane',
                    LAST_DONE_DAYS_AGO: '%d giorni fa',
                    LAST_DONE_PREFIX: '🗓 Ultima volta: ',
                    LAST_DONE_TODAY: 'Oggi',
                    LAST_DONE_YESTERDAY: 'Ieri',
                    LOADING: 'Caricamento...',
                    LOADING_ERROR: 'Impossibile recuperare i dati da Flatastic',
                    MORE_TASKS: 'e altri %d...',
                    ON_DEMAND: 'Quando necessario',
                    OVERDUE_DAY: '%d giorno di ritardo',
                    OVERDUE_DAYS: '%d giorni di ritardo',
                    SIGNIN_ERROR: 'Impossibile accedere a Flatastic',
                    WEEKLY: 'Settimanale',
                    YEARLY: 'Annuale'
                };
            default:
                return {};
        }
    },

    start: function() {
        var self = this;
        self.translations = this.getTranslations(this.config.language);
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
                card = card.replace(/{{%PLACE%}}/g, ++c);
                card = card.replace(/{{%USER_NAME%}}/g, user.firstName);
                if (this.config.statisticsConfig.showChorePoints) {
                    card = card.replace(/{{%POINTS%}}/g, user.actualPoints);
                    card = card.replace(/{{%HIDE_CHORE%}}/g, "");
                } else {
                    card = card.replace(/{{%POINTS%}}/g, "");
                    card = card.replace(/{{%HIDE_CHORE%}}/g, "hidden");
                }
                card = card.replace(/{{%USER_IMAGE_URL%}}/g, user.profileImage);
                if (this.config.statisticsConfig.showMoney) {
                    card = card.replace(/{{%USER_CASH_VALUE%}}/g, (Math.round(user.balance * 100) / 100));
                    card = card.replace(/{{%USER_CASH_CURRENCY%}}/g, this.wgInfo.currency);
                    card = card.replace(/{{%HIDE_CASH%}}/g, "");
                } else {
                    card = card.replace(/{{%HIDE_CASH%}}/g, "hidden");
                }
                card = card.replace(/{{%GOOD_BAD_CLASS%}}/g, user.balance >= 0 ? "profit" : "debt");
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
                        '<span class="default">' + this.translations.MORE_TASKS.replace("%d", (this.taskList.length - this.config.taskListConfig.maxDisplayItems)) + '</span>' +
                        '</div>' +
                        '</div>';
                    taskCard += moreCard;
                    break;
                }
                var card = JSON.parse(JSON.stringify(this.FT_CARD));
                var user = this.getUserById(element.currentUser);
                card = card.replace(/{{%FLATMATE_NAME%}}/g, user.firstName);
                if (element.rotationTime == -1) {
                    card = card.replace(/{{%DATE%}}/g, this.translations.ON_DEMAND);
                    card = card.replace(/{{%REPEATING_INFO%}}/g, this.unixToLastDone(element.lastDoneDate));
                } else {
                    card = card.replace(/{{%DATE%}}/g, this.unixToDueTime(element.timeLeftNext));
                    card = card.replace(/{{%REPEATING_INFO%}}/g, this.unixToRepetition(element.rotationTime))
                    if (this.unixToDays(element.timeLeftNext) > 0) {
                        card = card.replace(/{{%GOOD_BAD_CLASS%}}/g, "profit");
                    } else if (this.unixToDays(element.timeLeftNext) < 0) {
                        card = card.replace(/{{%GOOD_BAD_CLASS%}}/g, "debt");
                    }
                }
                card = card.replace(/{{%CHORE_NAME%}}/g, element.title);
                card = card.replace(/{{%GOOD_BAD_CLASS%}}/g, "default");
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
        var text = this.translations.LAST_DONE_PREFIX;
        var days = unixLastDoneDate - new Date().getTime() / 1000;
        days = this.unixToDays(days);
        days = Math.abs(days);
        if (days == 0) return text + this.translations.LAST_DONE_TODAY;
        if (days == 1) return text + this.translations.LAST_DONE_YESTERDAY;
        return text + this.translations.LAST_DONE_DAYS_AGO.replace("%d", days);
    },
    unixToRepetition: function(unixRange) {
        var text = "⟳";
        var days = this.unixToDays(unixRange);
        if (days == 1) return text + " " + this.translations.DAILY;
        if (days == 2) return text + " " + this.translations.EVERY_TWO_DAYS;
        if (days == 3) return text + " " + this.translations.EVERY_THREE_DAYS;
        if (days == 4) return text + " " + this.translations.EVERY_FOUR_DAYS;
        if (days == 5) return text + " " + this.translations.EVERY_FIVE_DAYS;
        if (days == 6) return text + " " + this.translations.EVERY_SIX_DAYS;
        if (days == 7) return text + " " + this.translations.WEEKLY;
        if (days == 365) return text + " " + this.translations.YEARLY;
        if (days % 7 == 0) { return text + " " + this.translations.EVERY_X_WEEKS.replace("%d", days/7); }
        return text + " " + this.translations.EVERY_X_DAYS.replace("%d", days);
    },
    unixToDueTime: function(unixRange) {
        var days = this.unixToDays(unixRange);
        var single = Math.abs(days) == 1;
        if (days < 0) {
            return single ?
                this.translations.OVERDUE_DAY.replace("%d", Math.abs(days)) :
                this.translations.OVERDUE_DAYS.replace("%d", Math.abs(days));
        } else if (days > 0) {
            return single ?
                this.translations.DUE_IN_DAY.replace("%d", Math.abs(days)) :
                this.translations.DUE_IN_DAYS.replace("%d", Math.abs(days));
        } else {
            return this.translations.DUE_TODAY;
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
