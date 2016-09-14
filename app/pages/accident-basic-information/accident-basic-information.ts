import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";


import {AccidentVehiclePage} from '../accident-vehicle/accident-vehicle';

/*
  Generated class for the AccidentBasicInformationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-basic-information/accident-basic-information.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class AccidentBasicInformationPage {

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {

  }

  goToAccidentVehicle(){
    this.navCtrl.push(AccidentVehiclePage);
  }

}
