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
var app_1 = require("../../providers/app/app");
var http_client_1 = require("../../providers/http-client/http-client");
var user_1 = require("../../providers/user/user");
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var keys_1 = require('../../pipes/keys');
/*
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AboutPage = (function () {
    function AboutPage(navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.loadingData = false;
        this.loadingMessages = [];
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingSystemInformation();
        });
    }
    AboutPage.prototype.loadingSystemInformation = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading system information');
        this.user.getUserSystemInformation().then(function (systemInformation) {
            _this.systemInformation = JSON.parse(systemInformation);
            _this.loadAppInformation();
        });
    };
    AboutPage.prototype.loadAppInformation = function () {
        var _this = this;
        this.setLoadingMessages('Loading app information');
        this.user.getAppInformation().then(function (appInformation) {
            _this.appInformation = appInformation;
            _this.loadingStorageStatus();
        });
    };
    AboutPage.prototype.loadingStorageStatus = function () {
        this.loadingData = false;
        //this.app.getStorageStatus(this.currentUser.currentDatabase).then(status=>{
        //  alert(JSON.stringify(status));
        //  this.loadingData = false;
        //},error=>{
        //  alert('Fails');
        //  this.loadingData = false;
        //});
    };
    AboutPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    AboutPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AboutPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    AboutPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/about/about.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite],
            pipes: [keys_1.Keys]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], AboutPage);
    return AboutPage;
})();
exports.AboutPage = AboutPage;
