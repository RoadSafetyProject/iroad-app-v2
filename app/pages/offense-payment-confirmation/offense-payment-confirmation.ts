import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {OffensePaymentCodePage} from "../offense-payment-code/offense-payment-code";

/*
  Generated class for the OffensePaymentConfirmationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offense-payment-confirmation/offense-payment-confirmation.html',
})
export class OffensePaymentConfirmationPage {

  constructor(private navCtrl: NavController) {

  }

  goToOffensePaymentCode(){
    this.navCtrl.push(OffensePaymentCodePage);
  }
}
