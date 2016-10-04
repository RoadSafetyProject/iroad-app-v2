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
var event_provider_1 = require("../../providers/event-provider/event-provider");
var view_historical_records_1 = require('../view-historical-records/view-historical-records');
/*
  Generated class for the DriverVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var DriverVerificationPage = (function () {
    function DriverVerificationPage(eventProvider, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.driver = {};
        this.programName = "Driver";
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
    DriverVerificationPage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.setLoadingMessages('Loading Driver metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    DriverVerificationPage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.setLoadingMessages('Set Driver metadata');
            this.relationDataElement = {};
            this.program = programs[0];
            this.setRelationDataElement();
        }
        else {
            this.loadingData = false;
        }
    };
    DriverVerificationPage.prototype.setRelationDataElement = function () {
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
    DriverVerificationPage.prototype.loadingAccidentMetadata = function () {
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
    DriverVerificationPage.prototype.loadingOffenseEventMeData = function () {
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
    DriverVerificationPage.prototype.setProgramNameDataElementMapping = function (programs) {
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
    DriverVerificationPage.prototype.scanBarcode = function () {
        var _this = this;
        ionic_native_1.BarcodeScanner.scan().then(function (barcodeData) {
            _this.driver.driverLisence = barcodeData.text;
            if (_this.relationDataElement.id) {
                _this.verificationData = [];
                _this.loadData();
            }
            else {
                _this.setToasterMessage('Fail to set relation data element');
            }
        }, function () {
            _this.setStickToasterMessage('Fail to scan barcode');
        });
    };
    DriverVerificationPage.prototype.verifyDriver = function () {
        if (this.driver.driverLisence && this.driver.driverLisence != "") {
            if (this.relationDataElement.id) {
                this.verificationData = [];
                this.loadData();
            }
            else {
                this.setToasterMessage('Fail to set relation data element');
            }
        }
        else {
            this.setToasterMessage('Please enter driver licence');
        }
    };
    DriverVerificationPage.prototype.loadData = function () {
        var _this = this;
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Fetching driver information');
        this.eventProvider.findEventsByDataValue(this.relationDataElement.id, this.driver.driverLisence, this.program.id, this.currentUser).then(function (events) {
            _this.setLoadedData(events);
        }, function (error) {
            _this.setToasterMessage('Fail to verify, please your network connection');
            _this.loadingData = false;
        });
    };
    DriverVerificationPage.prototype.setLoadedData = function (events) {
        if (events.length > 0) {
            this.driver.events = events[0];
            this.verificationData = events[0].dataValues;
            this.loadingAccidentVehicleHistory();
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Driver does not exist in the system');
        }
    };
    DriverVerificationPage.prototype.loadingAccidentVehicleHistory = function () {
        var _this = this;
        this.setLoadingMessages('Loading accident history');
        var dataElementId = this.programNameDataElementMapping[this.programAccidentVehicle];
        var value = this.driver.events.event;
        var programId = this.programNameProgramMapping[this.programAccidentVehicle];
        this.eventProvider.findEventsByDataValue(dataElementId, value, programId, this.currentUser).then(function (events) {
            _this.setAccidentVehicleHistory(events);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load accident history');
        });
    };
    DriverVerificationPage.prototype.setAccidentVehicleHistory = function (events) {
        this.accidentVehicleHistory = events;
        this.loadingOffenceHistory();
    };
    DriverVerificationPage.prototype.loadingOffenceHistory = function () {
        var _this = this;
        this.setLoadingMessages('Loading offence history');
        var dataElementId = this.programNameDataElementMapping[this.programOffenceEvent];
        var value = this.driver.events.event;
        var programId = this.programNameProgramMapping[this.programOffenceEvent];
        this.eventProvider.findEventsByDataValue(dataElementId, value, programId, this.currentUser).then(function (events) {
            _this.setOffenceHistory(events);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to load accident history');
        });
    };
    DriverVerificationPage.prototype.setOffenceHistory = function (events) {
        this.offenceHistory = events;
        this.loadingData = false;
    };
    DriverVerificationPage.prototype.ViewHistoricalRecords = function (nameOfHistoricalRecords) {
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
    DriverVerificationPage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
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
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], DriverVerificationPage);
    return DriverVerificationPage;
})();
exports.DriverVerificationPage = DriverVerificationPage;
