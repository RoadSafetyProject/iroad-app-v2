import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import {HomePage} from '../home/home'

/*
  Generated class for the AccidentWitnessPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-witness/accident-witness.html',
})
export class AccidentWitnessPage {

  constructor(private navCtrl: NavController) {

  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
