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
/*
  Generated class for the ReportOffencePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var ReportOffencePage = (function () {
    function ReportOffencePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ReportOffencePage.prototype.goToOffensePaymentConfirmation = function () {
        this.navCtrl.push(offense_payment_confirmation_1.OffensePaymentConfirmationPage);
    };
    ReportOffencePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/report-offence/report-offence.html',
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], ReportOffencePage);
    return ReportOffencePage;
})();
exports.ReportOffencePage = ReportOffencePage;
