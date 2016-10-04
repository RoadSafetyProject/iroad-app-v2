var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var event_provider_1 = require("../../providers/event-provider/event-provider");
;
/*
 Generated class for the ViewHistoricalRecordsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ViewHistoricalRecordsPage = (function () {
    function ViewHistoricalRecordsPage(params, eventProvider, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.params = params;
        this.eventProvider = eventProvider;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.historicalRecordsIds = [];
        this.dataElementToDataElementNameMapping = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.relationDataElementPrefix = "Program_";
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.nameOfHistoricalRecords = _this.params.get('nameOfHistoricalRecords');
            _this.historicalRecordsIds = _this.params.get('historicalRecordsIds');
            _this.programName = _this.params.get('programName');
            _this.loadingProgram();
        });
    }
    ViewHistoricalRecordsPage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.setLoadingMessages('Loading ' + this.programName + ' metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setLoadingMessages('Setting ' + _this.programName + ' metadata');
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    //@todo get relation data values
    ViewHistoricalRecordsPage.prototype.setProgramMetadata = function (programs) {
        var _this = this;
        if (programs.length > 0) {
            this.program = programs[0];
            this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                if (programStageDataElement.displayInReports) {
                    if (!programStageDataElement.dataElement.name.startsWith(_this.relationDataElementPrefix)) {
                        _this.dataElementToDataElementNameMapping[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name;
                    }
                    else {
                    }
                }
            });
            this.loadingEventData();
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Fail to find ' + this.programName + ' metadata');
        }
    };
    ViewHistoricalRecordsPage.prototype.loadingEventData = function () {
        var _this = this;
        this.setLoadingMessages('Loading ' + this.nameOfHistoricalRecords);
        this.eventProvider.getEventByEventIds(this.historicalRecordsIds, this.program.id, this.currentUser).then(function (events) {
            _this.setEventData(events);
            _this.loadingData = false;
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load ' + _this.nameOfHistoricalRecords);
        });
    };
    ViewHistoricalRecordsPage.prototype.setEventData = function (events) {
        this.historicalRecords = events;
    };
    ViewHistoricalRecordsPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    ViewHistoricalRecordsPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ViewHistoricalRecordsPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ViewHistoricalRecordsPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/view-historical-records/view-historical-records.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, event_provider_1.EventProvider, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], ViewHistoricalRecordsPage);
    return ViewHistoricalRecordsPage;
})();
exports.ViewHistoricalRecordsPage = ViewHistoricalRecordsPage;
