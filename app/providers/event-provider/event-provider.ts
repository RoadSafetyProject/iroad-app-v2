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

