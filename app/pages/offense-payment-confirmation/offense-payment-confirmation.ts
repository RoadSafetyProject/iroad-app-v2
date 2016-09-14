import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {OffensePaymentCodePage} from "../offense-payment-code/offense-payment-code";

/*
  Generated class for the OffensePaymentConfirmationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offense-payment-confirmation/offense-payment-confirmation.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class OffensePaymentConfirmationPage {

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {

  }

  goToOffensePaymentCode(){
    this.navCtrl.push(OffensePaymentCodePage);
  }
}
