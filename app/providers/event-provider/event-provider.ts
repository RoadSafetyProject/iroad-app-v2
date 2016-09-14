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
    alert('dataElementId :: ' + dataElementId);
    alert(' value:: ' + value );
    alert(' programId :: ' + programId);
    alert(' user :: ' +JSON.stringify(user));
  }

}

