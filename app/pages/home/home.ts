import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {HttpClient} from '../../providers/http-client/http-client';
import {User } from '../../providers/user/user';

import { ReportAccidentPage } from '../report-accident/report-accident';
import { ReportOffencePage } from '../report-offence/report-offence';
import { DriverVerificationPage } from '../driver-verification/driver-verification';
import { VehicleVerificationPage } from '../vehicle-verification/vehicle-verification';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
  providers : [HttpClient,User]
})
export class HomePage {

  public currentUser : any;
  public userData : any;

  public pages: Array<{title: string, component: any}>;

  constructor(private navCtrl: NavController,private httpClient:HttpClient,private user : User) {
    //this.getCurrentUser();
    this.pages = [
      { title: 'Report Accident', component: ReportAccidentPage},
      { title: 'Report Offence', component: ReportOffencePage },
      { title: 'Driver Verification', component: DriverVerificationPage},
      { title: 'Vehicle Verification', component: VehicleVerificationPage}
    ];
  }

  getCurrentUser(){
    this.user.getCurrentUser().then(user=>{
      this.currentUser = JSON.parse(user);
    });
    this.user.getUserData().then(userData=>{
      this.userData = JSON.parse(userData);
    });
  }

  openPage(page) {
    this.navCtrl.setRoot(page.component);
  }

}
