import { Component } from '@angular/core';
import { NavController ,ToastController} from 'ionic-angular';
import {OffensePaymentConfirmationPage} from "../offense-payment-confirmation/offense-payment-confirmation";

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the ReportOffencePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-offence/report-offence.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class ReportOffencePage {

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {

  }

  goToOffensePaymentConfirmation(){
    this.navCtrl.push(OffensePaymentConfirmationPage);
  }
}
