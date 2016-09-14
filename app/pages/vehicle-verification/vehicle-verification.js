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
        this.currentUser = {};
        this.program = {};
        this.user.getCurrentUser().then(function (currentUser) {
            _this.currentUser = JSON.parse(currentUser);
            _this.loadingProgram();
        });
    }
    VehicleVerificationPage.prototype.verifyVehicle = function () {
        this.vehicle.plateNumber = this.vehicle.plateNumber.toUpperCase();
        if (this.vehicle.plateNumber.length == 7) {
            this.vehicle.plateNumber = this.vehicle.plateNumber.substr(0, 4) + ' ' + this.vehicle.plateNumber.substr(4);
        }
        if (this.vehicle.plateNumber && this.relationDataElement.id) {
            this.loadData();
        }
        else {
            this.setToasterMessage('Please enter Vehicle Plate Number');
        }
    };
    VehicleVerificationPage.prototype.loadData = function () {
        this.eventProvider.findEventsByDataValue(this.relationDataElement.id, this.vehicle.plateNumber, this.program.id, this.currentUser);
    };
    VehicleVerificationPage.prototype.loadingProgram = function () {
        var _this = this;
        var resource = 'programs';
        var attribute = 'name';
        var attributeValue = [];
        attributeValue.push(this.programName);
        this.sqlLite.getDataFromTableByAttributes(resource, attribute, attributeValue, this.currentUser.currentDatabase).then(function (programs) {
            _this.setProgramMetadata(programs);
        }, function (error) {
            var message = "Fail to loading programs " + error;
            _this.setStickToasterMessage(message);
        });
    };
    VehicleVerificationPage.prototype.setProgramMetadata = function (programs) {
        if (programs.length > 0) {
            this.relationDataElement = {};
            this.program = programs[0];
            this.setRelationDataElement();
        }
    };
    VehicleVerificationPage.prototype.setRelationDataElement = function () {
        var _this = this;
        if (this.program.programStages.length > 0) {
            var relationDataElementCode = "id_" + this.programName;
            relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
            this.program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                if (programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() == relationDataElementCode) {
                    _this.relationDataElement = programStageDataElement.dataElement;
                }
            });
        }
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
