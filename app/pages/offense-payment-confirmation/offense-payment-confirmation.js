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
var offense_payment_code_1 = require("../offense-payment-code/offense-payment-code");
/*
  Generated class for the OffensePaymentConfirmationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var OffensePaymentConfirmationPage = (function () {
    function OffensePaymentConfirmationPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    OffensePaymentConfirmationPage.prototype.goToOffensePaymentCode = function () {
        this.navCtrl.push(offense_payment_code_1.OffensePaymentCodePage);
    };
    OffensePaymentConfirmationPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/offense-payment-confirmation/offense-payment-confirmation.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], OffensePaymentConfirmationPage);
    return OffensePaymentConfirmationPage;
})();
exports.OffensePaymentConfirmationPage = OffensePaymentConfirmationPage;
