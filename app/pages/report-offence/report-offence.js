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
var ionic_native_1 = require('ionic-native');
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
var sql_lite_1 = require("../../providers/sql-lite/sql-lite");
var event_provider_1 = require("../../providers/event-provider/event-provider");
/*
 Generated class for the ReportOffencePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var ReportOffencePage = (function () {
    function ReportOffencePage(eventProvider, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.sqlLite = sqlLite;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.offenseList = [];
        this.programName = "Offence Event";
        this.programOffenceRegistryName = 'Offence Registry';
        this.programOffence = {};
        this.offenceListDisplayName = "Nature";
        this.isOffenceDataElementToBeDisplayed = {};
        this.currentUser = {};
        this.program = {};
        this.dataValues = {};
        this.selectedOffenses = [];
        this.currentCoordinate = {};
        this.loadingData = false;
        this.loadingMessages = [];
        this.relationDataElements = {};
        this.relationDataElementProgramMapping = {};
        this.offenseListMetadataMapping = {};
        this.relationDataElementPrefix = "Program_";
        this.relationPrograms = {};
        this.data = {};
        //driver
        //todo checking other values to be captures
        this.mobileNumberDataElementName = "Phone Number";
        this.driverFullName = "Full Name";
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.programEventRelation = {};
            _this.mobileNumber = "";
            _this.loadingProgram();
        });
    }
    ReportOffencePage.prototype.loadingProgram = function () {
        var _this = this;
        this.loadingData = true;
        this.setLoadingMessages('Loading offence metadata');
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
    ReportOffencePage.prototype.setProgramMetadata = function (programs) {
        this.setGeoLocation();
        if (programs.length > 0) {
            this.program = programs[0];
            this.checkAndSetRelationDataElements();
            this.loadingOffenseRegistryProgram();
            this.loadingOffenceListMetadata();
        }
        else {
            this.loadingData = false;
        }
    };
    ReportOffencePage.prototype.checkAndSetRelationDataElements = function () {
        var _this = this;
        var programNames = [];
        this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name.startsWith(_this.relationDataElementPrefix)) {
                var programName = programStageDataElement.dataElement.name.replace(_this.relationDataElementPrefix, "");
                programNames.push(programName);
                _this.relationDataElementProgramMapping[programName] = programStageDataElement.dataElement.id;
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    program: programName,
                };
            }
            else if (programStageDataElement.dataElement.valueType == 'BOOLEAN') {
                _this.dataValues[programStageDataElement.dataElement.id] = "false";
            }
        });
        this.fetchingPrograms(programNames);
    };
    ReportOffencePage.prototype.fetchingPrograms = function (programNames) {
        var _this = this;
        this.relationPrograms = {};
        this.setLoadingMessages('Loading Relation programs metadata');
        programNames.forEach(function (programName) {
            var resource = 'programs';
            var attribute = 'name';
            var attributeValue = [];
            attributeValue.push(programName);
            _this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, _this.currentUser.currentDatabase).then(function (programs) {
                _this.setRelationProgramMetadata(programs, programName);
            }, function (error) {
            });
        });
    };
    ReportOffencePage.prototype.setRelationProgramMetadata = function (programs, programName) {
        var _this = this;
        this.relationPrograms[programName] = programs[0];
        programs[0].programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name.toLowerCase() == _this.mobileNumberDataElementName.toLowerCase()) {
                _this.mobileNumberDataElement = programStageDataElement.dataElement;
            }
            else if (programStageDataElement.dataElement.name.toLowerCase() == _this.driverFullName.toLowerCase()) {
                _this.driverFullNameDataElement = programStageDataElement.dataElement;
            }
        });
    };
    ReportOffencePage.prototype.loadingOffenseRegistryProgram = function () {
        var _this = this;
        this.setLoadingMessages('Loading offence(s) list metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push('Offence Registry');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.getOffenceEventList(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    ReportOffencePage.prototype.loadingOffenceListMetadata = function () {
        var _this = this;
        this.setLoadingMessages('Loading Offence list metadata');
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push('Offence');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setOffenceListMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    ReportOffencePage.prototype.setOffenceListMetadata = function (programs) {
        var _this = this;
        this.programOffence = programs[0];
        programs[0].programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name == 'Program_' + _this.programName.replace(' ', '_')) {
                _this.offenseListMetadataMapping[_this.programName] = programStageDataElement.dataElement.id;
            }
            else if (programStageDataElement.dataElement.name == 'Program_' + _this.programOffenceRegistryName.replace(' ', '_')) {
                _this.offenseListMetadataMapping[_this.programOffenceRegistryName] = programStageDataElement.dataElement.id;
            }
        });
    };
    ReportOffencePage.prototype.getOffenceEventList = function (programs) {
        var _this = this;
        this.setLoadingMessages('Loading offence(s) list from local storage');
        var resource = 'events';
        var attribute = 'program';
        var attributeValue = [];
        attributeValue.push(programs[0].id);
        this.isOffenceDataElementToBeDisplayed = {};
        programs[0].programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.name.toLowerCase() == _this.offenceListDisplayName.toLowerCase()) {
                _this.isOffenceDataElementToBeDisplayed[programStageDataElement.dataElement.id] = true;
            }
            else {
                _this.isOffenceDataElementToBeDisplayed[programStageDataElement.dataElement.id] = false;
            }
        });
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (offenceEventList) {
            _this.setOffenceEventList(offenceEventList);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    ReportOffencePage.prototype.setOffenceEventList = function (offenceEventList) {
        var _this = this;
        this.loadingData = false;
        this.offenseList = [];
        offenceEventList.forEach(function (event) {
            _this.offenseList.push(event);
        });
    };
    ReportOffencePage.prototype.prepareSavingOffenceInformation = function () {
        if (this.selectedOffenses.length > 0) {
            this.loadingData = true;
            this.loadingMessages = [];
            this.fetchingDriver();
        }
        else {
            this.setToasterMessage('Please select at least one offence from offence list');
        }
    };
    ReportOffencePage.prototype.fetchingDriver = function () {
        var _this = this;
        if (this.data.licenceNumber) {
            this.setLoadingMessages('Fetching driver information');
            var programName = 'Driver';
            var program = this.relationPrograms[programName];
            var relationDataElementId = this.eventProvider.getRelationDataElementIdForSqlView(program.programStages[0].programStageDataElements, programName);
            this.eventProvider.findEventsByDataValue(relationDataElementId, this.data.licenceNumber, program.id, this.currentUser).then(function (events) {
                _this.setDriverDataValue(events, programName);
            }, function (error) {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to verify driver');
            });
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Please Enter Driver licence number');
        }
    };
    ReportOffencePage.prototype.setDriverDataValue = function (events, programName) {
        var _this = this;
        if (events.length > 0) {
            //set set programs to eventId relation mapper
            this.programEventRelation[programName] = { event: events[0].event, program: events[0].program };
            var relationDataElementId = this.relationDataElementProgramMapping[programName];
            this.dataValues[relationDataElementId] = events[0].event;
            events[0].dataValues.forEach(function (dataValue) {
                if (dataValue.dataElement == _this.mobileNumberDataElement.id) {
                    _this.mobileNumber = dataValue.value;
                }
                else if (dataValue.dataElement == _this.driverFullNameDataElement.id) {
                    _this.driverName = dataValue.value;
                }
            });
            this.fetchingVehicle();
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Driver has not found');
        }
    };
    ReportOffencePage.prototype.fetchingVehicle = function () {
        var _this = this;
        if (this.data.plateNumber) {
            this.setLoadingMessages('Fetching vehicle information');
            var programName = 'Vehicle';
            this.data.plateNumber = this.data.plateNumber.toUpperCase();
            if (this.data.plateNumber.length == 7) {
                this.data.plateNumber = this.data.plateNumber.substr(0, 4) + ' ' + this.data.plateNumber.substr(4);
            }
            var program = this.relationPrograms[programName];
            var relationDataElementId = this.eventProvider.getRelationDataElementIdForSqlView(program.programStages[0].programStageDataElements, programName);
            this.eventProvider.findEventsByDataValue(relationDataElementId, this.data.plateNumber, program.id, this.currentUser).then(function (events) {
                _this.setVehicleDataValue(events, programName);
            }, function (error) {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to verify vehicle');
            });
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Please Enter Vehicle plate number');
        }
    };
    //@todo checking for required fields
    ReportOffencePage.prototype.setVehicleDataValue = function (events, programName) {
        var _this = this;
        if (events.length > 0) {
            //set set programs to eventId relation mapper
            this.programEventRelation[programName] = { event: events[0].event, program: events[0].program };
            var relationDataElementId = this.relationDataElementProgramMapping[programName];
            this.dataValues[relationDataElementId] = events[0].event;
            /*
            let parameters = {
              offenceId: 'eventId',
              mobileNumber: this.mobileNumber,
              driverName: this.driverName,
              programEventRelation : this.programEventRelation,
              offenceListId: this.selectedOffenses
            };
            this.loadingData = false;
            this.navCtrl.push(OffensePaymentConfirmationPage,parameters);
            */
            this.setLoadingMessages('Prepare offence information to save');
            this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues, this.program, this.currentUser, this.currentCoordinate).then(function (event) {
                _this.setLoadingMessages('Saving offence information');
                _this.eventProvider.saveEvent(event, _this.currentUser).then(function (result) {
                    _this.prepareSavingOffenceList(result);
                }, function (error) {
                    _this.loadingData = false;
                    _this.setToasterMessage('Fail to save offense information to the server');
                });
            });
        }
        else {
            this.loadingData = false;
            this.setToasterMessage('Vehicle has not found');
        }
    };
    ReportOffencePage.prototype.prepareSavingOffenceList = function (result) {
        var _this = this;
        var eventId = result.response.importSummaries[0].reference;
        var dataValuesArray = [];
        this.selectedOffenses.forEach(function (offenseId) {
            var dataValue = {};
            dataValue[_this.offenseListMetadataMapping[_this.programOffenceRegistryName]] = offenseId;
            dataValue[_this.offenseListMetadataMapping[_this.programName]] = eventId;
            dataValuesArray.push(dataValue);
        });
        this.setLoadingMessages('Prepare Offence list information');
        this.eventProvider.getFormattedDataValuesArrayToEventObjectList(dataValuesArray, this.programOffence, this.currentUser).then(function (eventList) {
            _this.setLoadingMessages('Saving Offence list information');
            _this.eventProvider.saveEventList(eventList, _this.currentUser).then(function () {
                _this.goToOffensePaymentConfirmation(eventId);
            }, function () {
                _this.loadingData = false;
                _this.setToasterMessage('Fail to save offense list information');
            });
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage('Fail to prepare offense list information');
        });
    };
    ReportOffencePage.prototype.goToOffensePaymentConfirmation = function (eventId) {
        var parameters = {
            offenceId: eventId,
            mobileNumber: this.mobileNumber,
            driverName: this.driverName,
            programEventRelation: this.programEventRelation,
            offenceListId: this.selectedOffenses
        };
        this.loadingData = false;
        this.navCtrl.push(offense_payment_confirmation_1.OffensePaymentConfirmationPage, parameters);
    };
    ReportOffencePage.prototype.setGeoLocation = function () {
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
    ReportOffencePage.prototype.setLoadingMessages = function (message) {
        this.loadingMessages.push(message);
    };
    ReportOffencePage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    ReportOffencePage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    ReportOffencePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/report-offence/report-offence.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], ReportOffencePage);
    return ReportOffencePage;
})();
exports.ReportOffencePage = ReportOffencePage;
