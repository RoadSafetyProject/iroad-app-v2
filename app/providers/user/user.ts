import { Injectable } from '@angular/core';
import { Storage, LocalStorage } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppVersion } from 'ionic-native';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the User provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class User {

  private localStorage : Storage;

  constructor(private http: Http) {
    this.localStorage = new Storage(LocalStorage);
  }

  setCurrentUser(user){
    this.localStorage.set('user',JSON.stringify(user));
    return Promise.resolve(user);
  }

  setUserSystemInformation(systemInformation){
    this.localStorage.set('systemInformation',JSON.stringify(systemInformation));
    return Promise.resolve(systemInformation);
  }
  setUserData(userDataResponse){
    let userData ={
      "Name": userDataResponse.name,
      "Employer": userDataResponse.employer,
      "Job Title": userDataResponse.jobTitle,
      "Education": userDataResponse.education,
      "Gender": userDataResponse.gender,
      "Birthday": userDataResponse.birthday,
      "Nationality": userDataResponse.nationality,
      "Interests": userDataResponse.interests,
      "userRoles": userDataResponse.userCredentials.userRoles,
      "organisationUnits": userDataResponse.organisationUnits
    };

    this.localStorage.set('userData',JSON.stringify(userData));

    return Promise.resolve(userData);
  }

  getUserData(){
    return this.localStorage.get('userData');
  }

  getAppInformation(){
    let appInformation = {};
    let promises = [];

    return new Promise(function(resolve, reject) {
      promises.push(
        AppVersion.getAppName().then(appName=>{
          appInformation['appName'] = appName;
        })
      );
      promises.push(
        AppVersion.getPackageName().then(packageName=>{
          appInformation['packageName'] = packageName;
        })
      );
      promises.push(
        AppVersion.getVersionCode().then(versionCode=>{
          appInformation['versionCode'] = versionCode;
        })
      );
      promises.push(
        AppVersion.getVersionNumber().then(versionNumber=>{
          appInformation['versionNumber'] = versionNumber;
        })
      );

      Observable.forkJoin(promises).subscribe(() => {
          resolve(appInformation);
        },
        (error) => {
          reject();
        })
    });
  }

  getUserSystemInformation(){
    return this.localStorage.get('systemInformation');
  }

  getCurrentUser(){
    return this.localStorage.get('user');
  }

}

