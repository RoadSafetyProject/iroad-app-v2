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
var event_provider_1 = require("../../providers/event-provider/event-provider");
/*
  Generated class for the OffencePaymentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var OffencePaymentPage = (function () {
    //@todo incorporate Transaction Number and Reference Number
    function OffencePaymentPage(eventProvider, params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.programPaymentReceipt = 'Payment Receipt';
        this.programOffenceEvent = 'Offence Event';
        this.relationDataElementPrefix = "Program_";
        this.paymentAmountName = "Amount";
        this.relationDataElements = {};
        this.currentUser = {};
        this.program = {};
        this.dataValues = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.offenceId = this.params.get('offenceId');
        this.selectedOffences = this.params.get('selectedOffences');
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingPaymentReceipt();
        });
    }
    OffencePaymentPage.prototype.loadingPaymentReceipt = function () {
        var _this = this;
        this.loadingData = true;
        this.setLoadingMessages('Loading payment receipt metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programPaymentReceipt);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setPaymentReceipt(programs);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load payment receipt metadata');
        });
    };
    OffencePaymentPage.prototype.setPaymentReceipt = function (programs) {
        this.program = programs[0];
        this.checkAndSetRelationData();
    };
    OffencePaymentPage.prototype.checkAndSetRelationData = function () {
        var _this = this;
        this.setLoadingMessages('Checking for relation metadata');
        this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name == _this.paymentAmountName) {
                var total = 0;
                _this.selectedOffences.forEach(function (selectedOffence) {
                    total += parseInt(selectedOffence.cost);
                });
                _this.dataValues[programStageDataElement.dataElement.id] = total;
            }
            else if (programStageDataElement.dataElement.name.toLowerCase() == (_this.relationDataElementPrefix + _this.programOffenceEvent.replace(' ', '_')).toLowerCase()) {
                _this.dataValues[programStageDataElement.dataElement.id] = _this.offenceId;
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    program: _this.programOffenceEvent
                };
            }
            else if (programStageDataElement.dataElement.valueType == 'BOOLEAN') {
                _this.dataValues[programStageDataElement.dataElement.id] = "false";
            }
        });
        this.loadingData = false;
    };
    //@todo checking for required fields
    OffencePaymentPage.prototype.savePayment = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var currentCoordinate = {
            latitude: '0',
            longitude: '0'
        };
        this.setLoadingMessages('Preparing payment information for saving');
        this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues, this.program, this.currentUser, currentCoordinate).then(function (event) {
            _this.setLoadingMessages('Saving payment information');
            _this.eventProvider.saveEvent(event, _this.currentUser).then(function (result) {
                _this.loadingData = false;
                _this.setToasterMessage('Payment information has been saved successfully');
                _this.navCtrl.setRoot(home_1.HomePage);
            }, function (error) {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to prepare payment information');
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to prepare payment information');
        });
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
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], OffencePaymentPage);
    return OffencePaymentPage;
})();
exports.OffencePaymentPage = OffencePaymentPage;
