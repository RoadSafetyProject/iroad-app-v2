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
var home_1 = require("../home/home");
/*
  Generated class for the OffensePaymentConfirmationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var OffensePaymentConfirmationPage = (function () {
    function OffensePaymentConfirmationPage(params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.offenceListIds = [];
        this.programOffenceRegistry = 'Offence Registry';
        this.offenceListDisplayName = "Nature";
        this.offenceListCost = "Amount";
        this.offenceListDisplayNameToDataElement = {};
        this.currentUser = {};
        this.program = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.offenceId = _this.params.get('offenceId');
            _this.offenceListIds = _this.params.get('offenceListId');
            _this.loadingOffenceRegistryProgram();
        });
    }
    OffensePaymentConfirmationPage.prototype.loadingOffenceRegistryProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.setLoadingMessages('Loading offence List metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programOffenceRegistry);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setOffenceRegistryProgram(programs);
        }, function (error) {
            _this.setToasterMessage('Fail to load offence list metadata');
            _this.loadingData = false;
        });
    };
    OffensePaymentConfirmationPage.prototype.setOffenceRegistryProgram = function (programs) {
        var _this = this;
        this.program = programs[0];
        programs[0].programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name.toLowerCase() == _this.offenceListDisplayName.toLowerCase()) {
                _this.offenceListDisplayNameToDataElement[_this.offenceListDisplayName] = programStageDataElement.dataElement.id;
            }
            if (programStageDataElement.dataElement.name.toLowerCase() == _this.offenceListCost.toLowerCase()) {
                _this.offenceListDisplayNameToDataElement[_this.offenceListCost] = programStageDataElement.dataElement.id;
            }
        });
        this.loadSelectedOffences();
    };
    OffensePaymentConfirmationPage.prototype.loadSelectedOffences = function () {
        var _this = this;
        this.setLoadingMessages('Loading selected offence(s) list from local storage');
        var resource = 'events';
        var attribute = 'event';
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, this.offenceListIds, this.currentUser.currentDatabase).then(function (events) {
            _this.setSelectedOffences(events);
        }, function (error) {
            _this.setToasterMessage('Fail to load offence list metadata');
            _this.loadingData = false;
        });
    };
    OffensePaymentConfirmationPage.prototype.setSelectedOffences = function (events) {
        var _this = this;
        this.selectedOffences = [];
        this.selectedOffencesTotal = 0;
        events.forEach(function (event) {
            var offence = "";
            var cost = "";
            event.dataValues.forEach(function (dataValue) {
                if (dataValue.dataElement == _this.offenceListDisplayNameToDataElement[_this.offenceListCost]) {
                    cost = dataValue.value;
                    _this.selectedOffencesTotal += parseInt(cost);
                }
                else if (dataValue.dataElement == _this.offenceListDisplayNameToDataElement[_this.offenceListDisplayName]) {
                    offence = dataValue.value;
                }
            });
            _this.selectedOffences.push({
                offence: offence,
                cost: cost
            });
        });
        this.loadingData = false;
    };
    OffensePaymentConfirmationPage.prototype.goToOffensePaymentCode = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var message = this.getOffenseNotificationMessage();
        var number = '+255718922311';
        //let number = '+255717154006';
        this.setLoadingMessages('Sending message');
        this.app.sendSms(number, message).then(function () {
            _this.setToasterMessage('Payment details has been sent');
            _this.loadingData = false;
            _this.navCtrl.setRoot(home_1.HomePage);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to send payment details,please try to resend');
        });
    };
    OffensePaymentConfirmationPage.prototype.goToOffensePayment = function () {
        this.setToasterMessage('Pay now');
    };
    OffensePaymentConfirmationPage.prototype.getOffenseNotificationMessage = function () {
        this.setLoadingMessages('Composing message');
        var message = "OFFENCE NOTIFICATION\n Dear Joseph Chingalo,you have committed " + this.selectedOffences.length + " offences .\n";
        var total = 0;
        this.selectedOffences.forEach(function (selectedOffence) {
            total += parseInt(selectedOffence.cost);
        });
        message += 'Total cost Tsh ' + total + '. \n';
        message += 'Payment code is ' + this.offenceId;
        message += "\nIt's just testing from mobile app";
        return message;
    };
    OffensePaymentConfirmationPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    OffensePaymentConfirmationPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    OffensePaymentConfirmationPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    OffensePaymentConfirmationPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/offense-payment-confirmation/offense-payment-confirmation.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], OffensePaymentConfirmationPage);
    return OffensePaymentConfirmationPage;
})();
exports.OffensePaymentConfirmationPage = OffensePaymentConfirmationPage;
