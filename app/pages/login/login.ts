import { Component } from '@angular/core';
import { NavController ,Nav} from 'ionic-angular';

import { HomePage } from '../home/home';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  constructor(private navCtrl: NavController,private nav: Nav) {

  }

  login(){
    this.nav.setRoot(HomePage);
    //this.navCtrl.push(HomePage);
  }
}
