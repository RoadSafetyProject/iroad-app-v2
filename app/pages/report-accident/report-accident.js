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
var ionic_native_1 = require('ionic-native');
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var accident_basic_information_1 = require('../accident-basic-information/accident-basic-information');
/*
 Generated class for the ReportAccidentPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ReportAccidentPage = (function () {
    function ReportAccidentPage(navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
    }
    ReportAccidentPage.prototype.takePhoto = function () {
        var _this = this;
        var options = {
            destinationType: ionic_native_1.Camera.DestinationType.FILE_URI,
            sourceType: ionic_native_1.Camera.PictureSourceType.CAMERA
        };
        ionic_native_1.Camera.getPicture(options).then(function (imageData) {
            _this.mediaData = imageData;
            _this.setToasterMessage('Photo has been taken successfully');
        }, function () {
            _this.setToasterMessage('Fail to take a photo');
        });
    };
    ReportAccidentPage.prototype.pickPhotoFromGallery = function () {
        var _this = this;
        var options = {
            destinationType: ionic_native_1.Camera.DestinationType.NATIVE_URI,
            sourceType: ionic_native_1.Camera.PictureSourceType.PHOTOLIBRARY
        };
        ionic_native_1.Camera.getPicture(options).then(function (imageData) {
            _this.mediaData = imageData;
            _this.setToasterMessage('Photo has been selected successfully');
        }, function () {
            _this.setToasterMessage('Fail to pick a photo');
        });
    };
    ReportAccidentPage.prototype.takeVideo = function () {
        var _this = this;
        ionic_native_1.MediaCapture.captureVideo({ limit: 1 })
            .then(function (data) {
            //this.mediaData = data;
            alert(JSON.stringify(data));
            _this.setToasterMessage('Video has been selected successfully');
        }, function (err) {
            _this.setToasterMessage('Fail to take video');
        });
    };
    ReportAccidentPage.prototype.goToAccidentBasicInformation = function () {
        this.navCtrl.push(accident_basic_information_1.AccidentBasicInformationPage);
    };
    ReportAccidentPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ReportAccidentPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ReportAccidentPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/report-accident/report-accident.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], ReportAccidentPage);
    return ReportAccidentPage;
})();
exports.ReportAccidentPage = ReportAccidentPage;
