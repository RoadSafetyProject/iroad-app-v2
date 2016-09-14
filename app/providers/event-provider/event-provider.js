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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var http_client_1 = require('../../providers/http-client/http-client');
/*
  Generated class for the EventProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
var EventProvider = (function () {
    function EventProvider(http, httpClient) {
        this.http = http;
        this.httpClient = httpClient;
    }
    EventProvider.prototype.findEventsByDataValue = function (dataElementId, value, programId, user) {
        alert('dataElementId :: ' + dataElementId);
        alert(' value:: ' + value);
        alert(' programId :: ' + programId);
        alert(' user :: ' + JSON.stringify(user));
    };
    EventProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_client_1.HttpClient])
    ], EventProvider);
    return EventProvider;
})();
exports.EventProvider = EventProvider;
