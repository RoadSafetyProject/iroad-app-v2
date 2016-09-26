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
var accident_witness_1 = require('../accident-witness/accident-witness');
/*
  Generated class for the AccidentVehiclePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AccidentVehiclePage = (function () {
    function AccidentVehiclePage(params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.params = params;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.programName = "Accident Vehicle";
        this.currentUser = {};
        this.program = {};
        //private dataValues : any = {};
        this.dataValuesArray = [];
        this.data = [];
        this.currentCoordinate = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.currentVehicle = "0";
        this.relationDataElements = {};
        this.programNameRelationDataElementMapping = {};
        this.relationDataElementPrefix = "Program_";
        this.programDriver = 'Driver';
        this.programVehicle = 'Vehicle';
        this.programAccident = 'Accident';
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.accidentId = _this.params.get('accidentId');
            _this.loadingProgram();
        });
    }
    AccidentVehiclePage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.setLoadingMessages('Loading accident vehicle metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setLoadingMessages('Setting accident vehicle metadata');
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    AccidentVehiclePage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.program = programs[0];
            this.setGeoLocation();
            this.setAndCheckingForRelationMetaData();
        }
        else {
            this.loadingData = false;
        }
    };
    AccidentVehiclePage.prototype.setAndCheckingForRelationMetaData = function () {
        var _this = this;
        this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            var dataElementName = programStageDataElement.dataElement.name;
            if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programDriver.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programNameRelationDataElementMapping[_this.programDriver] = programStageDataElement.dataElement.id;
            }
            else if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programVehicle.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programNameRelationDataElementMapping[_this.programVehicle] = programStageDataElement.dataElement.id;
            }
            else if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programAccident.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programAccidentId = programStageDataElement.dataElement.id;
            }
        });
        this.addVehicle();
        this.loadingData = false;
    };
    AccidentVehiclePage.prototype.addVehicle = function () {
        var dataValue = {};
        dataValue[this.programAccidentId] = this.accidentId;
        this.dataValuesArray.push(dataValue);
    };
    AccidentVehiclePage.prototype.removeVehicle = function (vehicleIndex) {
        this.dataValuesArray.splice(vehicleIndex, 1);
        if (this.dataValuesArray.length == 1) {
            this.currentVehicle = "0";
        }
        else if (parseInt(this.currentVehicle) == this.dataValuesArray.length) {
            this.currentVehicle = "" + (this.dataValuesArray.length - 1);
        }
    };
    AccidentVehiclePage.prototype.showSegment = function (vehicleIndex) {
        this.currentVehicle = "" + vehicleIndex;
    };
    AccidentVehiclePage.prototype.goToAccidentWitness = function () {
        alert('dataValuesArray :: ' + JSON.stringify(this.dataValuesArray));
        var parameter = {
            accidentId: this.accidentId
        };
        alert(parameter);
        this.navCtrl.push(accident_witness_1.AccidentWitnessPage, parameter);
    };
    AccidentVehiclePage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    AccidentVehiclePage.prototype.setGeoLocation = function () {
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
    AccidentVehiclePage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    AccidentVehiclePage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    AccidentVehiclePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/accident-vehicle/accident-vehicle.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], AccidentVehiclePage);
    return AccidentVehiclePage;
})();
exports.AccidentVehiclePage = AccidentVehiclePage;
