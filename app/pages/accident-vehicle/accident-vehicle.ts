import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {AccidentWitnessPage} from '../accident-witness/accident-witness'

/*
  Generated class for the AccidentVehiclePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-vehicle/accident-vehicle.html',
})
export class AccidentVehiclePage {

  constructor(private navCtrl: NavController) {

  }

  goToAccidentWitness(){
    this.navCtrl.push(AccidentWitnessPage);
  }

}
