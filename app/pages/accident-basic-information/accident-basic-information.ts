import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import {AccidentVehiclePage} from '../accident-vehicle/accident-vehicle';

/*
  Generated class for the AccidentBasicInformationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-basic-information/accident-basic-information.html',
})
export class AccidentBasicInformationPage {

  constructor(private navCtrl: NavController) {

  }

  goToAccidentVehicle(){
    this.navCtrl.push(AccidentVehiclePage);
  }

}
