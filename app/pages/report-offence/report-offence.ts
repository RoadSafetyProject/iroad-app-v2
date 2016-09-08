import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {OffensePaymentConfirmationPage} from "../offense-payment-confirmation/offense-payment-confirmation";

/*
  Generated class for the ReportOffencePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-offence/report-offence.html',
})
export class ReportOffencePage {

  constructor(private navCtrl: NavController) {

  }

  goToOffensePaymentConfirmation(){
    this.navCtrl.push(OffensePaymentConfirmationPage);
  }
}
