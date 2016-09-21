import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import {HttpClient} from '../../providers/http-client/http-client';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class EventProvider {

  constructor(private http: Http,private httpClient: HttpClient) {

  }

  getRelationDataElementIdForSqlView(programStageDataElements,programName){
    let dataElementId = "";
    let relationDataElementCode = "id_" + programName;
    relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
    programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() ==relationDataElementCode){
        dataElementId = programStageDataElement.dataElement.id;
      }
    });
    return dataElementId;
  }

  saveEventList(eventList,user){
    let self = this;
    let promises = [];

    return new Promise(function(resolve, reject) {
      eventList.forEach(event=>{
        promises.push(
          self.saveEvent(event,user).then((response)=>{
            //saving success
          },(error) => {
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve();
        },
        (error) => {
          reject();
        })
    });
  }

  saveEvent(event,user){
    let self = this;
    let url = '/api/events';
    return new Promise(function(resolve, reject){
      self.httpClient.post(url,event,user).subscribe(response=>{
        response = response.json();
        resolve(response);
      },error=>{
        alert(JSON.stringify(error));
        reject(error);
      })
    });
  }

  getFormattedDataValuesArrayToEventObjectList(dataValuesArray,program,user){
    let self = this;
    let currentCoordinate = {
      latitude : '0',
      longitude : '0'
    };
    let promises = [];
    let eventList = [];

    return new Promise(function(resolve, reject) {
      dataValuesArray.forEach(dataValues=>{
        promises.push(
          self.getFormattedDataValuesToEventObject(dataValues,program,user,currentCoordinate).then((event)=>{
            //saving success
            eventList.push(event);
          },(error) => {
          })
        );
      });

      Observable.forkJoin(promises).subscribe(() => {
          resolve(eventList);
        },
        (error) => {
          reject();
        })
    });


  }

  getFormattedDataValuesToEventObject(dataValues,program,user,currentCoordinate){

    return new Promise(function(resolve){
      let event = {
        program : program.id,
        orgUnit : user.orgUnit,
        eventDate : new Date(),
        status : "COMPLETED",
        storedBy : user.username,
        coordinate : currentCoordinate,
        dataValues : []
      };
      program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
        let dataElementId = programStageDataElement.dataElement.id;
        if(dataValues[dataElementId]){
          event.dataValues.push({
            dataElement : dataElementId,
            value : dataValues[dataElementId]
          })
        }
      });
      resolve(event)
    });
  }

  findEventsByDataValue(dataElementId,value,programId,user){
    let self = this;
    let sqlViewUrl = "/api/sqlViews.json?filter=name:eq:Find Event";

    return new Promise(function(resolve, reject){
      self.httpClient.get(sqlViewUrl,user).subscribe(sqlViewData=>{
        sqlViewData = sqlViewData.json();
        self.getEventIdList(dataElementId,value,sqlViewData,programId,user).then(events=>{
          resolve(events);
        },error=>{
          reject(error);
        })
      },error=>{
        reject(error);
      });
    });


  }

  getEventIdList(dataElementId,value,sqlViewData,programId,user){
    let self = this;
    let sqlViewEventsUrl = "/api/sqlViews/" + sqlViewData.sqlViews[0].id + "/data.json?var=dataElement:" + dataElementId + "&var=value:" + value;

    return new Promise(function(resolve, reject){
      self.httpClient.get(sqlViewEventsUrl,user).subscribe(eventsIdData=>{
        eventsIdData = eventsIdData.json();
        self.getEvents(eventsIdData,programId,user).then(events=>{
          resolve(events);
        },error=>{
          reject(error);
        })
      },error=>{
        reject(error);
      });
    });

  }

  getEvents(eventsIdData,programId,user){
    let eventIDs = [];
    let events = [];
    let self = this;
    eventsIdData.rows.forEach(row=>{
      if(row.length>0){
        eventIDs.push(row[0])
      }
    });

    return new Promise(function(resolve, reject){
      if (eventIDs.length >0) {
        let eventListUrl = "/api/events.json?program=" + programId + "&event=" + eventIDs.join(";");
        self.httpClient.get(eventListUrl,user).subscribe(eventListData=>{
          eventListData = eventListData.json();
          resolve(self.getEventList(eventListData));
        },error=>{
          reject(error);
        })
      }else{
        resolve(events);
      }
    });
  }

  getEventList(eventListData){
    return eventListData.events;
  }

}

