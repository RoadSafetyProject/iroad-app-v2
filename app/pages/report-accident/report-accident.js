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
var accident_basic_information_1 = require('../accident-basic-information/accident-basic-information');
/*
 Generated class for the ReportAccidentPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ReportAccidentPage = (function () {
    function ReportAccidentPage(navCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
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
            _this.setStickToasterMessage('Fail to take a photo');
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
            _this.setStickToasterMessage('Fail to take a photo');
        });
    };
    ReportAccidentPage.prototype.takeVideo = function () {
        this.setToasterMessage('This functionality is currently not supported');
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
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController])
    ], ReportAccidentPage);
    return ReportAccidentPage;
})();
exports.ReportAccidentPage = ReportAccidentPage;
