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
var home_1 = require('../home/home');
var event_provider_1 = require("../../providers/event-provider/event-provider");
/*
  Generated class for the AccidentWitnessPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AccidentWitnessPage = (function () {
    function AccidentWitnessPage(eventProvider, params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.programName = "Accident Witness";
        this.currentUser = {};
        this.program = {};
        this.dataValuesArray = [];
        this.currentCoordinate = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.currentWitness = "0";
        this.relationDataElements = {};
        this.relationDataElementPrefix = "Program_";
        this.programAccident = 'Accident';
        this.signatureDataElement = {
            name: "Signature",
            id: "",
            imageData: [],
            value: ""
        };
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.accidentId = _this.params.get('accidentId');
            _this.loadingProgram();
        });
    }
    AccidentWitnessPage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Loading accident witness metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setLoadingMessages('Setting accident witness metadata');
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    AccidentWitnessPage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.program = programs[0];
            this.setGeoLocation();
            this.setAndCheckingForRelationMetaData();
        }
        else {
            this.loadingData = false;
        }
    };
    AccidentWitnessPage.prototype.setAndCheckingForRelationMetaData = function () {
        var _this = this;
        this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            var dataElementName = programStageDataElement.dataElement.name;
            if (dataElementName.toLowerCase() == _this.signatureDataElement.name.toLocaleLowerCase()) {
                _this.signatureDataElement.id = programStageDataElement.dataElement.id;
            }
            if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programAccident.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programAccidentId = programStageDataElement.dataElement.id;
            }
        });
        this.addWitness();
        this.loadingData = false;
    };
    AccidentWitnessPage.prototype.addWitness = function () {
        var dataValue = {};
        dataValue[this.programAccidentId] = this.accidentId;
        this.dataValuesArray.push(dataValue);
        this.currentWitness = "" + (this.dataValuesArray.length - 1);
    };
    AccidentWitnessPage.prototype.removeWitness = function (witnessIndex) {
        this.dataValuesArray.splice(witnessIndex, 1);
        this.deleteSignature(witnessIndex);
        if (this.dataValuesArray.length == 1) {
            this.currentWitness = "0";
        }
        else if (parseInt(this.currentWitness) == this.dataValuesArray.length) {
            this.currentWitness = "" + (this.dataValuesArray.length - 1);
        }
        else {
            this.currentWitness = "" + (witnessIndex - 1);
        }
    };
    AccidentWitnessPage.prototype.showSegment = function (witnessIndex) {
        this.currentWitness = "" + witnessIndex;
    };
    AccidentWitnessPage.prototype.setGeoLocation = function () {
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
    AccidentWitnessPage.prototype.initiateSignaturePad = function (witnessIndex) {
        var canvas = document.getElementById('signatureCanvasWitness_' + witnessIndex);
        this.signaturePad = new SignaturePad(canvas);
    };
    AccidentWitnessPage.prototype.saveSignaturePad = function (witnessIndex) {
        this.signatureDataElement.imageData[witnessIndex] = this.signaturePad.toDataURL();
    };
    AccidentWitnessPage.prototype.deleteSignature = function (witnessIndex) {
        if (this.signatureDataElement.imageData[witnessIndex]) {
            this.signatureDataElement.imageData.splice(witnessIndex, 1);
        }
    };
    AccidentWitnessPage.prototype.uploadFIleServer = function () {
        //@todo uploading signature
        //this.formatDataValues();
    };
    //@todo checking for required fields
    AccidentWitnessPage.prototype.prepareToSaveAccidentWitness = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Preparing to accident witness information');
        var dataValuesArrayList = [];
        this.dataValuesArray.forEach(function (dataValues) {
            if (Object.keys(dataValues).length > 1) {
                dataValuesArrayList.push(dataValues);
            }
        });
        if (dataValuesArrayList.length > 0) {
            this.eventProvider.getFormattedDataValuesArrayToEventObjectList(dataValuesArrayList, this.program, this.currentUser).then(function (eventList) {
                _this.setLoadingMessages('Saving accident witness information');
                _this.eventProvider.saveEventList(eventList, _this.currentUser).then(function (result) {
                    _this.setToasterMessage('Accident witness information has been saved successfully');
                    _this.navCtrl.setRoot(home_1.HomePage);
                }, function (error) {
                    _this.loadingData = false;
                    _this.setToasterMessage('Fail to save accident witness information');
                });
            }, function (error) {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to prepare accident witness information');
            });
        }
        else {
            this.loadingData = false;
        }
    };
    AccidentWitnessPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    AccidentWitnessPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AccidentWitnessPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    AccidentWitnessPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/accident-witness/accident-witness.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], AccidentWitnessPage);
    return AccidentWitnessPage;
})();
exports.AccidentWitnessPage = AccidentWitnessPage;
