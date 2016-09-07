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
  Generated class for the VehicleVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var VehicleVerificationPage = (function () {
    function VehicleVerificationPage(navCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.vehicle = {};
    }
    VehicleVerificationPage.prototype.verifyVehicle = function () {
        if (this.vehicle.plateNumber) {
            console.log('Hello, verify driver licence');
            this.loadData();
        }
        else {
            this.setToasterMessage('Please enter Vehicle Plate Number');
        }
    };
    VehicleVerificationPage.prototype.loadData = function () {
        this.vehicle.response = {
            owner: "Joseph Chingalo",
            plateNumber: this.vehicle.plateNumber,
            date: '2016-06-07'
        };
    };
    VehicleVerificationPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    VehicleVerificationPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    VehicleVerificationPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/vehicle-verification/vehicle-verification.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, ionic_angular_1.ToastController])
    ], VehicleVerificationPage);
    return VehicleVerificationPage;
})();
exports.VehicleVerificationPage = VehicleVerificationPage;