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
/*
  Generated class for the DriverVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var DriverVerificationPage = (function () {
    function DriverVerificationPage(navCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.driver = {};
    }
    DriverVerificationPage.prototype.scanBarcode = function () {
        console.log('Hello, scan licence');
        this.driver.driverLisence = "41000034995";
        this.loadData();
    };
    DriverVerificationPage.prototype.verifyDriver = function () {
        if (this.driver.driverLisence) {
            console.log('Hello, verify driver licence');
            this.loadData();
        }
        else {
            this.setToasterMessage('Please enter driver licence');
        }
    };
    DriverVerificationPage.prototype.loadData = function () {
        this.driver.response = {
            name: "Joseph Chingalo",
            licenceNumber: this.driver.driverLisence,
            date: '2016-06-07'
        };
    };
    DriverVerificationPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    DriverVerificationPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    DriverVerificationPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/driver-verification/driver-verification.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController])
    ], DriverVerificationPage);
    return DriverVerificationPage;
})();
exports.DriverVerificationPage = DriverVerificationPage;
