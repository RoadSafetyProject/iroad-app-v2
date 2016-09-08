import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from "../home/home";

/*
  Generated class for the OffensePaymentCodePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offense-payment-code/offense-payment-code.html',
})
export class OffensePaymentCodePage {

  constructor(private navCtrl: NavController) {

  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }
}
