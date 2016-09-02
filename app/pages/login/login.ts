import { Component } from '@angular/core';
import { NavController ,ToastController} from 'ionic-angular';

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

  private loginData : any ={};

  constructor(private navCtrl: NavController,public app : App,public toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
  }

  login(){
    if(this.loginData.serveUrl){
      this.app.getFormattedBaseUrl(this.loginData.serveUrl)
        .then(formattedBaseUrl => {
          this.loginData.serveUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.app.getDataBaseName(this.loginData.serveUrl).then(databaseName=>{
              console.log(databaseName);
              console.log(this.loginData);
            });

          }
        });
    }else{
      this.setToasterMessage('Please Enter server url');
    }

  }

  setToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
