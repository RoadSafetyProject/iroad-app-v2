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
var event_provider_1 = require("../../providers/event-provider/event-provider");
var view_historical_records_1 = require('../view-historical-records/view-historical-records');
/*
  Generated class for the VehicleVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var VehicleVerificationPage = (function () {
    function VehicleVerificationPage(eventProvider, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.vehicle = {};
        this.programName = "Vehicle";
        this.programAccidentVehicle = "Accident Vehicle";
        this.programAccident = "Accident";
        this.programOffenceEvent = "Offence Event";
        this.programNameDataElementMapping = {};
        this.relationDataElementPrefix = "Program_";
        this.programNameProgramMapping = {};
        this.accidentVehicleHistory = [];
        this.offenceHistory = [];
        this.currentUser = {};
        this.program = {};
        this.verificationData = [];
        this.dataElementListObject = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingProgram();
        });
    }
    VehicleVerificationPage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.setLoadingMessages('Loading Vehicle metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    VehicleVerificationPage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.setLoadingMessages('Set Vehicle metadata');
            this.relationDataElement = {};
            this.program = programs[0];
            this.setRelationDataElement();
        }
        else {
            this.loadingData = false;
        }
    };
    VehicleVerificationPage.prototype.setRelationDataElement = function () {
        var _this = this;
        if (this.program.programStages.length > 0) {
            var relationDataElementCode = "id_" + this.programName;
            relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
            this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                _this.dataElementListObject[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name,
                    displayInReports: programStageDataElement.displayInReports,
                    compulsory: programStageDataElement.compulsory
                };
                if (programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() == relationDataElementCode) {
                    _this.relationDataElement = programStageDataElement.dataElement;
                }
            });
            this.loadingAccidentMetadata();
        }
    };
    VehicleVerificationPage.prototype.loadingAccidentMetadata = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programAccidentVehicle);
        this.setLoadingMessages('Loading accident vehicle Relation metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramNameDataElementMapping(programs);
            _this.loadingOffenseEventMeData();
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading accident vehicle Relation metadata ";
            _this.setStickToasterMessage(message);
        });
    };
    VehicleVerificationPage.prototype.loadingOffenseEventMeData = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programOffenceEvent);
        this.setLoadingMessages('Loading offence Relation metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramNameDataElementMapping(programs);
            _this.loadingData = false;
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading offence Relation metadata ";
            _this.setStickToasterMessage(message);
        });
    };
    VehicleVerificationPage.prototype.setProgramNameDataElementMapping = function (programs) {
        var _this = this;
        var programName = programs[0].name;
        this.programNameProgramMapping[programName] = programs[0].id;
        programs[0].programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if ((_this.relationDataElementPrefix + _this.programName.replace(' ', '_')).toLowerCase() == programStageDataElement.dataElement.name.toLowerCase()) {
                _this.programNameDataElementMapping[programName] = programStageDataElement.dataElement.id;
            }
            if ((_this.relationDataElementPrefix + _this.programAccident.replace(' ', '_')).toLowerCase() == programStageDataElement.dataElement.name.toLowerCase()) {
                _this.programNameDataElementMapping[_this.programAccident] = programStageDataElement.dataElement.id;
            }
        });
    };
    VehicleVerificationPage.prototype.verifyVehicle = function () {
        if (this.vehicle.plateNumber) {
            this.vehicle.plateNumber = this.vehicle.plateNumber.toUpperCase();
            if (this.vehicle.plateNumber.length == 7) {
                this.vehicle.plateNumber = this.vehicle.plateNumber.substr(0, 4) + ' ' + this.vehicle.plateNumber.substr(4);
            }
            this.verificationData = [];
            if (this.relationDataElement.id) {
                this.loadData();
            }
            else {
                this.setToasterMessage('Fail to set relation data element ');
            }
        }
        else {
            this.setToasterMessage('Please enter Vehicle Plate Number');
        }
    };
    VehicleVerificationPage.prototype.loadData = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Fetching vehicle information');
        this.eventProvider.findEventsByDataValue(this.relationDataElement.id, this.vehicle.plateNumber, this.program.id, this.currentUser).then(function (events) {
            _this.setLoadedData(events);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to verify, please your network connection');
        });
    };
    VehicleVerificationPage.prototype.setLoadedData = function (events) {
        if (events.length > 0) {
            this.vehicle.events = events[0];
            this.verificationData = events[0].dataValues;
            this.loadingAccidentVehicleHistory();
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Vehicle does not exist in the system');
        }
    };
    VehicleVerificationPage.prototype.loadingAccidentVehicleHistory = function () {
        var _this = this;
        this.setLoadingMessages('Loading accident history');
        var dataElementId = this.programNameDataElementMapping[this.programAccidentVehicle];
        var value = this.vehicle.events.event;
        var programId = this.programNameProgramMapping[this.programAccidentVehicle];
        this.eventProvider.findEventsByDataValue(dataElementId, value, programId, this.currentUser).then(function (events) {
            _this.setAccidentVehicleHistory(events);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load accident history');
        });
    };
    VehicleVerificationPage.prototype.setAccidentVehicleHistory = function (events) {
        this.accidentVehicleHistory = events;
        this.loadingOffenceHistory();
    };
    VehicleVerificationPage.prototype.loadingOffenceHistory = function () {
        var _this = this;
        this.setLoadingMessages('Loading offence history');
        var dataElementId = this.programNameDataElementMapping[this.programOffenceEvent];
        var value = this.vehicle.events.event;
        var programId = this.programNameProgramMapping[this.programOffenceEvent];
        this.eventProvider.findEventsByDataValue(dataElementId, value, programId, this.currentUser).then(function (events) {
            _this.setOffenceHistory(events);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load accident history');
        });
    };
    VehicleVerificationPage.prototype.setOffenceHistory = function (events) {
        this.offenceHistory = events;
        this.loadingData = false;
    };
    VehicleVerificationPage.prototype.ViewHistoricalRecords = function (nameOfHistoricalRecords) {
        var title = "";
        var historicalRecordsIds = [];
        if (nameOfHistoricalRecords == this.programAccident) {
            var dataElementId = this.programNameDataElementMapping[nameOfHistoricalRecords];
            title = "List of Accidents";
            this.accidentVehicleHistory.forEach(function (accidentVehicle) {
                accidentVehicle.dataValues.forEach(function (dataValue) {
                    if (dataValue.dataElement == dataElementId) {
                        historicalRecordsIds.push(dataValue.value);
                    }
                });
            });
        }
        else if (nameOfHistoricalRecords == this.programOffenceEvent) {
            title = "List Of Offence";
            this.offenceHistory.forEach(function (offence) {
                historicalRecordsIds.push(offence.event);
            });
        }
        var parameter = {
            programName: nameOfHistoricalRecords,
            nameOfHistoricalRecords: title,
            historicalRecordsIds: historicalRecordsIds
        };
        this.navCtrl.push(view_historical_records_1.ViewHistoricalRecordsPage, parameter);
    };
    VehicleVerificationPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
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
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], VehicleVerificationPage);
    return VehicleVerificationPage;
})();
exports.VehicleVerificationPage = VehicleVerificationPage;
