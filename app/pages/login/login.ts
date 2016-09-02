import { Component } from '@angular/core';
import { NavController ,Nav} from 'ionic-angular';

import { HomePage } from '../home/home';


import { App } from '../../providers/app/app';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [App]
})
export class LoginPage {

  loginData : any ={};


  constructor(private navCtrl: NavController,public app : App) {
    this.loginData.logoUrl = 'img/logo.png';
  }

  login(){
    this.app.getFormattedBaseUrl(this.loginData.serveUrl)
      .then(formattedBaseUrl => {
        this.loginData.serveUrl = formattedBaseUrl;
        console.log(this.loginData);
      });
  }
}
