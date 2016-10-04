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
var accident_vehicle_1 = require('../accident-vehicle/accident-vehicle');
var event_provider_1 = require("../../providers/event-provider/event-provider");
/*
  Generated class for the AccidentBasicInformationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AccidentBasicInformationPage = (function () {
    function AccidentBasicInformationPage(eventProvider, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.programName = "Accident";
        this.currentUser = {};
        this.program = {};
        this.dataValues = {};
        this.currentCoordinate = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.signatureDataElement = {
            name: "Signature",
            id: "",
            imageData: "",
            value: ""
        };
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingProgram();
        });
    }
    AccidentBasicInformationPage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading accident basic information metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    AccidentBasicInformationPage.prototype.setProgramMetadata = function (programs) {
        var _this = this;
        if (programs.length > 0) {
            this.program = programs[0];
            this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                if (programStageDataElement.dataElement.name.toLowerCase() == _this.signatureDataElement.name.toLocaleLowerCase()) {
                    _this.signatureDataElement.id = programStageDataElement.dataElement.id;
                }
            });
        }
        this.setGeoLocation();
        this.loadingData = false;
    };
    AccidentBasicInformationPage.prototype.initiateSignaturePad = function () {
        var canvas = document.getElementById('signatureCanvas');
        this.signaturePad = new SignaturePad(canvas);
    };
    AccidentBasicInformationPage.prototype.saveSignaturePad = function () {
        this.signatureDataElement.imageData = this.signaturePad.toDataURL();
    };
    AccidentBasicInformationPage.prototype.uploadFIleServer = function () {
        //@todo uploading signature
        this.formatDataValues();
    };
    AccidentBasicInformationPage.prototype.prepareToSaveBasicInformation = function () {
        this.loadingData = true;
        this.loadingMessages = [];
        if (this.signatureDataElement.imageData) {
            this.setLoadingMessages('Uploading Signature');
            this.uploadFIleServer();
        }
        else {
            this.formatDataValues();
        }
    };
    AccidentBasicInformationPage.prototype.formatDataValues = function () {
        var _this = this;
        //@todo checking for required fields
        this.setLoadingMessages('Preparing accident basic information');
        this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues, this.program, this.currentUser, this.currentCoordinate).then(function (event) {
            _this.setLoadingMessages('Saving accident basic information');
            _this.eventProvider.saveEvent(event, _this.currentUser).then(function (result) {
                _this.goToAccidentVehicle(result);
            }, function (error) {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to save accident basic information');
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to prepare accident basic information');
        });
    };
    AccidentBasicInformationPage.prototype.goToAccidentVehicle = function (result) {
        var eventId = result.response.importSummaries[0].reference;
        var parameter = {
            accidentId: eventId
        };
        this.loadingData = false;
        this.navCtrl.push(accident_vehicle_1.AccidentVehiclePage, parameter);
    };
    AccidentBasicInformationPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    AccidentBasicInformationPage.prototype.setGeoLocation = function () {
        var _this = this;
        ionic_native_1.Geolocation.getCurrentPosition().then(function (resp) {
            if (resp.coords.latitude) {
                _this.currentCoordinate.latitude = resp.coords.latitude;
            }
            else {
                _this.currentCoordinate.latitude = '0';
            }
            if (resp.coords.longitude) {
                _this.currentCoordinate.longitude = resp.coords.longitude;
            }
            else {
                _this.currentCoordinate.longitude = '0';
            }
        });
    };
    AccidentBasicInformationPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AccidentBasicInformationPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    AccidentBasicInformationPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/accident-basic-information/accident-basic-information.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], AccidentBasicInformationPage);
    return AccidentBasicInformationPage;
})();
exports.AccidentBasicInformationPage = AccidentBasicInformationPage;
