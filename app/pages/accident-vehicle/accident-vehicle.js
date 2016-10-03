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
var event_provider_1 = require("../../providers/event-provider/event-provider");
/*
  Generated class for the AccidentVehiclePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var AccidentVehiclePage = (function () {
    function AccidentVehiclePage(eventProvider, params, navCtrl, toastCtrl, sqlLite, user, httpClient, app) {
        var _this = this;
        this.eventProvider = eventProvider;
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
        this.programDriverName = 'Driver';
        this.programDriver = {};
        this.programVehicle = {};
        this.driversObjectData = [];
        this.vehiclesObjectData = [];
        this.programVehicleName = 'Vehicle';
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
            if (dataElementName.toLowerCase() == _this.signatureDataElement.name.toLocaleLowerCase()) {
                _this.signatureDataElement.id = programStageDataElement.dataElement.id;
            }
            if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programDriverName.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programNameRelationDataElementMapping[_this.programDriverName] = programStageDataElement.dataElement.id;
            }
            else if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programVehicleName.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programNameRelationDataElementMapping[_this.programVehicleName] = programStageDataElement.dataElement.id;
            }
            else if (dataElementName.toLowerCase() == (_this.relationDataElementPrefix + _this.programAccident.replace(' ', '_')).toLowerCase()) {
                _this.relationDataElements[programStageDataElement.dataElement.id] = {
                    name: programStageDataElement.dataElement.name
                };
                _this.programAccidentId = programStageDataElement.dataElement.id;
            }
        });
        this.loadDriverMetadata();
    };
    AccidentVehiclePage.prototype.loadDriverMetadata = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programDriverName);
        this.setLoadingMessages('Loading driver metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setLoadingMessages('Setting driver metadata');
            _this.setDriverMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    AccidentVehiclePage.prototype.setDriverMetadata = function (programs) {
        this.programDriver = programs[0];
        this.dataElementDriverId = this.eventProvider.getRelationDataElementIdForSqlView(this.programDriver.programStages[0].programStageDataElements, this.programDriverName);
        this.loadVehicleMetadata();
    };
    AccidentVehiclePage.prototype.loadVehicleMetadata = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programVehicleName);
        this.setLoadingMessages('Loading vehicle metadata');
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setLoadingMessages('Setting vehicle metadata');
            _this.setVehicleMetadata(programs);
        }, function (error) {
            _this.loadingData = false;
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    AccidentVehiclePage.prototype.setVehicleMetadata = function (programs) {
        this.programVehicle = programs[0];
        this.dataElementVehicleId = this.eventProvider.getRelationDataElementIdForSqlView(this.programVehicle.programStages[0].programStageDataElements, this.programVehicleName);
        this.addVehicle();
        this.loadingData = false;
    };
    AccidentVehiclePage.prototype.addVehicle = function () {
        var dataValue = {};
        dataValue[this.programAccidentId] = this.accidentId;
        this.dataValuesArray.push(dataValue);
        this.currentVehicle = "" + (this.dataValuesArray.length - 1);
    };
    AccidentVehiclePage.prototype.removeVehicle = function (vehicleIndex) {
        this.dataValuesArray.splice(vehicleIndex, 1);
        this.deleteSignature(vehicleIndex);
        if (this.dataValuesArray.length == 1) {
            this.currentVehicle = "0";
        }
        else if (parseInt(this.currentVehicle) == this.dataValuesArray.length) {
            this.currentVehicle = "" + (this.dataValuesArray.length - 1);
        }
        else {
            this.currentVehicle = "" + (vehicleIndex - 1);
        }
    };
    AccidentVehiclePage.prototype.showSegment = function (vehicleIndex) {
        this.currentVehicle = "" + vehicleIndex;
    };
    AccidentVehiclePage.prototype.initiateSignaturePad = function (vehicleIndex) {
        var canvas = document.getElementById('signatureCanvasAccidentVehicle_' + vehicleIndex);
        this.signaturePad = new SignaturePad(canvas);
    };
    AccidentVehiclePage.prototype.saveSignaturePad = function (vehicleIndex) {
        this.signatureDataElement.imageData[vehicleIndex] = this.signaturePad.toDataURL();
    };
    AccidentVehiclePage.prototype.deleteSignature = function (vehicleIndex) {
        if (this.signatureDataElement.imageData[vehicleIndex]) {
            this.signatureDataElement.imageData.splice(vehicleIndex, 1);
        }
    };
    AccidentVehiclePage.prototype.uploadFIleServer = function () {
        //@todo uploading signature
        //this.formatDataValues();
    };
    AccidentVehiclePage.prototype.prepareToSaveAccidentVehicle = function () {
        this.loadingData = true;
        this.loadingMessages = [];
        this.setLoadingMessages('Preparing accident vehicle information');
        var parameter = {
            accidentId: this.accidentId
        };
        this.setToasterMessage('Accident Vehicles has been saved successfully');
        this.loadingData = false;
        this.navCtrl.push(accident_witness_1.AccidentWitnessPage, parameter);
        //let dataValuesArrayList = [];
        //this.dataValuesArray.forEach((dataValues:any,index : any)=>{
        //  if(Object.keys(dataValues).length > 1){
        //    if(this.hasVehiclePlateNumberAndDriverLicence(dataValues,index)){
        //      dataValuesArrayList.push(dataValues);
        //    }
        //  }
        //});
        //if(dataValuesArrayList.length == this.dataValuesArray.length ){
        //  this.fetchingDrivers();
        //}else{
        //  this.loadingData = false;
        //}
    };
    AccidentVehiclePage.prototype.hasVehiclePlateNumberAndDriverLicence = function (dataValues, index) {
        var result = true;
        if (!dataValues[this.dataElementDriverId]) {
            this.setToasterMessage('Please enter driver licence for vehicle ' + (index + 1));
            result = false;
        }
        else if (!dataValues[this.dataElementVehicleId]) {
            this.setToasterMessage('Please enter vehicle plate number for vehicle ' + (index + 1));
            result = false;
        }
        return result;
    };
    AccidentVehiclePage.prototype.fetchingDrivers = function () {
        var _this = this;
        this.setLoadingMessages("Fetching driver's information");
        var driverLicenceId = this.programNameRelationDataElementMapping[this.programDriverName];
        this.driversObjectData = [];
        this.dataValuesArray.forEach(function (dataValues) {
            if (dataValues[_this.dataElementDriverId]) {
                _this.driversObjectData.push({
                    dataElementId: _this.dataElementDriverId,
                    driverLicenceId: driverLicenceId,
                    value: dataValues[_this.dataElementDriverId],
                    eventData: []
                });
            }
        });
        this.eventProvider.findAndSetEventsToRelationDataValuesList(this.driversObjectData, this.programDriver.id, this.currentUser).then(function (RelationDataValuesList) {
            _this.setLoadingMessages("Setting driver's information");
            _this.setDrivers(RelationDataValuesList);
        }, function (error) {
            _this.loadingData = false;
            _this.setToasterMessage("Fail to fetch driver's information ");
        });
    };
    AccidentVehiclePage.prototype.setDrivers = function (RelationDataValuesList) {
        var _this = this;
        var shouldContinue = true;
        RelationDataValuesList.forEach(function (dataValues, index) {
            if (dataValues.eventData.length == 0) {
                shouldContinue = false;
                _this.setToasterMessage('Driver licence for vehicle ' + (index + 1) + ' has not found');
            }
        });
        if (shouldContinue) {
            this.driversObjectData = RelationDataValuesList;
            this.fetchingVehicles();
        }
        else {
            this.loadingData = false;
        }
    };
    AccidentVehiclePage.prototype.fetchingVehicles = function () {
        var _this = this;
        this.setLoadingMessages("Fetching vehicle's information");
        var vehiclePlateNumberId = this.programNameRelationDataElementMapping[this.programVehicleName];
        this.vehiclesObjectData = [];
        this.dataValuesArray.forEach(function (dataValues) {
            if (dataValues[_this.dataElementVehicleId]) {
                var plateNumber = dataValues[_this.dataElementVehicleId].toUpperCase();
                if (plateNumber.length == 7) {
                    plateNumber = plateNumber.substr(0, 4) + ' ' + plateNumber.substr(4);
                }
                dataValues[_this.dataElementVehicleId] = plateNumber;
                _this.vehiclesObjectData.push({
                    dataElementId: _this.dataElementVehicleId,
                    vehiclePlateNumberId: vehiclePlateNumberId,
                    value: plateNumber,
                    eventData: []
                });
            }
        });
        this.eventProvider.findAndSetEventsToRelationDataValuesList(this.vehiclesObjectData, this.programVehicle.id, this.currentUser).then(function (RelationDataValuesList) {
            _this.setLoadingMessages("Setting vehicle's information");
            _this.setVehicles(RelationDataValuesList);
        }, function (error) {
            _this.setToasterMessage("Fail to fetch vehicle's information");
            _this.loadingData = false;
        });
    };
    AccidentVehiclePage.prototype.setVehicles = function (RelationDataValuesList) {
        var _this = this;
        var shouldContinue = true;
        RelationDataValuesList.forEach(function (dataValues, index) {
            if (dataValues.eventData == 0) {
                shouldContinue = false;
                _this.setToasterMessage('Vehicle plate number for vehicle ' + (index + 1) + ' has not found');
            }
        });
        if (shouldContinue) {
            this.vehiclesObjectData = RelationDataValuesList;
            this.setAndSaveAccidentVehiclesInformation();
        }
        else {
            this.loadingData = false;
        }
    };
    //@todo checking for required fields
    AccidentVehiclePage.prototype.setAndSaveAccidentVehiclesInformation = function () {
        var _this = this;
        var newDataValuesArray = [];
        this.setLoadingMessages('Setting accident vehicle information');
        var driverLicenceId = this.programNameRelationDataElementMapping[this.programDriverName];
        var vehiclePlateNumberId = this.programNameRelationDataElementMapping[this.programVehicleName];
        this.dataValuesArray.forEach(function (dataValues, index) {
            newDataValuesArray.push(dataValues);
            newDataValuesArray[index][driverLicenceId] = _this.driversObjectData[index].eventData[0].event;
            newDataValuesArray[index][vehiclePlateNumberId] = _this.vehiclesObjectData[index].eventData[0].event;
        });
        this.eventProvider.getFormattedDataValuesArrayToEventObjectList(this.dataValuesArray, this.program, this.currentUser).then(function (eventList) {
            _this.setLoadingMessages('Saving accident vehicle information');
            _this.eventProvider.saveEventList(eventList, _this.currentUser).then(function (result) {
                var parameter = {
                    accidentId: _this.accidentId
                };
                _this.setToasterMessage('Accident Vehicles has been saved successfully');
                _this.loadingData = false;
                _this.navCtrl.push(accident_witness_1.AccidentWitnessPage, parameter);
            }, function (error) {
                _this.setToasterMessage('Fail to save accident vehicle information');
                _this.loadingData = false;
            });
        }, function (error) {
            _this.setToasterMessage('Fail to set accident vehicle information');
            _this.loadingData = false;
        });
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
            providers: [app_1.App, http_client_1.HttpClient, user_1.User, sql_lite_1.SqlLite, event_provider_1.EventProvider]
        }), 
        __metadata('design:paramtypes', [event_provider_1.EventProvider, ionic_angular_1.NavParams, ionic_angular_1.NavController, ionic_angular_1.ToastController, sql_lite_1.SqlLite, user_1.User, http_client_1.HttpClient, app_1.App])
    ], AccidentVehiclePage);
    return AccidentVehiclePage;
})();
exports.AccidentVehiclePage = AccidentVehiclePage;
