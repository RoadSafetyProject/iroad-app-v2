import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the App provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class App {

  private formattedBaseUrl :any;

  constructor(private http: Http) {}

  getFormattedBaseUrl(url){
    this.formattedBaseUrl = url;
    return Promise.resolve(this.formattedBaseUrl);

  }

}

