import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


/*
  Generated class for the ReportAccidentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-accident/report-accident.html',
})
export class ReportAccidentPage {

  constructor(private navCtrl: NavController) {

  }


  takePhoto(){
    console.log('takePhoto');
  }

  pickFromGallery(){
    console.log('pickFromGallery');
  }

  takeVideo(){
    console.log('takeVideo');
  }

}
