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
    EventProvider.prototype.getRelationDataElementIdForSqlView = function (programStageDataElements, programName) {
        var dataElementId = "";
        var relationDataElementCode = "id_" + programName;
        relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
        programStageDataElements.forEach(function (programStageDataElement) {
            if (programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() == relationDataElementCode) {
                dataElementId = programStageDataElement.dataElement.id;
            }
        });
        return dataElementId;
    };
    EventProvider.prototype.saveEvent = function (event, user) {
        var self = this;
        var url = '/api/events';
        return new Promise(function (resolve, reject) {
            self.httpClient.post(url, event, user).subscribe(function (response) {
                response = response.json();
                resolve(response);
            }, function (error) {
                alert(JSON.stringify(error));
                reject(error);
            });
        });
    };
    EventProvider.prototype.formatDataValuesToEventObject = function (dataValues, program, user, currentCoordinate) {
        return new Promise(function (resolve) {
            var event = {
                program: program.id,
                orgUnit: user.orgUnit,
                eventDate: new Date(),
                status: "COMPLETED",
                storedBy: user.username,
                coordinate: currentCoordinate,
                dataValues: []
            };
            program.programStages[0].programStageDataElements.forEach(function (programStageDataElement) {
                var dataElementId = programStageDataElement.dataElement.id;
                if (dataValues[dataElementId]) {
                    event.dataValues.push({
                        dataElement: dataElementId,
                        value: dataValues[dataElementId]
                    });
                }
            });
            resolve(event);
        });
    };
    EventProvider.prototype.findEventsByDataValue = function (dataElementId, value, programId, user) {
        var self = this;
        var sqlViewUrl = "/api/sqlViews.json?filter=name:eq:Find Event";
        return new Promise(function (resolve, reject) {
            self.httpClient.get(sqlViewUrl, user).subscribe(function (sqlViewData) {
                sqlViewData = sqlViewData.json();
                self.getEventIdList(dataElementId, value, sqlViewData, programId, user).then(function (events) {
                    resolve(events);
                }, function (error) {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    };
    EventProvider.prototype.getEventIdList = function (dataElementId, value, sqlViewData, programId, user) {
        var self = this;
        var sqlViewEventsUrl = "/api/sqlViews/" + sqlViewData.sqlViews[0].id + "/data.json?var=dataElement:" + dataElementId + "&var=value:" + value;
        return new Promise(function (resolve, reject) {
            self.httpClient.get(sqlViewEventsUrl, user).subscribe(function (eventsIdData) {
                eventsIdData = eventsIdData.json();
                self.getEvents(eventsIdData, programId, user).then(function (events) {
                    resolve(events);
                }, function (error) {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            });
        });
    };
    EventProvider.prototype.getEvents = function (eventsIdData, programId, user) {
        var eventIDs = [];
        var events = [];
        var self = this;
        eventsIdData.rows.forEach(function (row) {
            if (row.length > 0) {
                eventIDs.push(row[0]);
            }
        });
        return new Promise(function (resolve, reject) {
            if (eventIDs.length > 0) {
                var eventListUrl = "/api/events.json?program=" + programId + "&event=" + eventIDs.join(";");
                self.httpClient.get(eventListUrl, user).subscribe(function (eventListData) {
                    eventListData = eventListData.json();
                    resolve(self.getEventList(eventListData));
                }, function (error) {
                    reject(error);
                });
            }
            else {
                resolve(events);
            }
        });
    };
    EventProvider.prototype.getEventList = function (eventListData) {
        return eventListData.events;
    };
    EventProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, http_client_1.HttpClient])
    ], EventProvider);
    return EventProvider;
})();
exports.EventProvider = EventProvider;
