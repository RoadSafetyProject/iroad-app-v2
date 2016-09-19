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
var offense_payment_confirmation_1 = require("../offense-payment-confirmation/offense-payment-confirmation");
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
/*
  Generated class for the ReportOffencePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ReportOffencePage = (function () {
    function ReportOffencePage(navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.programName = "Offence";
        this.currentUser = {};
        this.program = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingProgram();
        });
    }
    ReportOffencePage.prototype.loadingProgram = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramMetadata(programs);
        }, function (error) {
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    ReportOffencePage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.program = programs[0];
        }
        //Offence Registry
    };
    ReportOffencePage.prototype.goToOffensePaymentConfirmation = function () {
        this.navCtrl.push(offense_payment_confirmation_1.OffensePaymentConfirmationPage);
    };
    ReportOffencePage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    ReportOffencePage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ReportOffencePage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ReportOffencePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/report-offence/report-offence.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], ReportOffencePage);
    return ReportOffencePage;
})();
exports.ReportOffencePage = ReportOffencePage;
