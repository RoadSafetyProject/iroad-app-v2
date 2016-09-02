import { Injectable } from '@angular/core';
import { Http ,Headers} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HttpClient provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class HttpClient {

  private baseUrl : string;
  constructor(private http: Http) {
    this.baseUrl = ""
  }

  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', 'Basic ' +
      btoa('admin:IROAD2015'));
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(this.baseUrl + url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(this.baseUrl + url, data, {
      headers: headers
    });
  }

}

