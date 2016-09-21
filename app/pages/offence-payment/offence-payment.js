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
/*
  Generated class for the OffencePaymentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var OffencePaymentPage = (function () {
    //@todo incorporate Transaction Number and Reference Number
    //@todo send sms to driver or vehicle's owner mobile number
    function OffencePaymentPage(params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.offenceListIds = [];
        this.programPaymentReciept = 'Payment Reciept';
        this.programOffenceEvent = 'Offence Event';
        this.relationDataElementPrefix = "Program_";
        this.relationDataElements = {};
        this.currentUser = {};
        this.program = {};
        this.dataValues = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.offenceId = this.params.get('offenceId');
        this.offenceListIds = this.params.get('offenceListId');
        this.loadingPaymentReceipt();
    }
    OffencePaymentPage.prototype.loadingPaymentReceipt = function () {
        this.loadingData = true;
        this.setLoadingMessages('Loading payment receipt metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
    };
    OffencePaymentPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    OffencePaymentPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    OffencePaymentPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    OffencePaymentPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/offence-payment/offence-payment.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], OffencePaymentPage);
    return OffencePaymentPage;
})();
exports.OffencePaymentPage = OffencePaymentPage;
