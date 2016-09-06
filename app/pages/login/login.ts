import { Component } from '@angular/core';
import { NavController ,ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [App,HttpClient,User]
})
export class LoginPage {

  private loginData : any ={};

  constructor(private navCtrl: NavController,private user: User,private httpClient: HttpClient,private app : App,private toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
  }

  login(){
    if(this.loginData.serverUrl){
      this.app.getFormattedBaseUrl(this.loginData.serverUrl)
        .then(formattedBaseUrl => {
          this.loginData.serverUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
              console.log(databaseName);
              this.user.setCurrentUser(this.loginData).then(user=>{
                console.log(user);
                this.httpClient.get('/api/me.json',user).subscribe(
                  data => {
                    console.log('success login');
                    this.setToasterMessage('success to login ' + JSON.stringify(data));
                    console.log(data);
                    console.log('databaseName');
                    console.log(databaseName);
                    this.navCtrl.setRoot(HomePage);
                  },
                  err => {
                    this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                    console.log(err);
                  }
                );
              }).catch(err=>{
                console.log(err);
              })

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

  setStickToasterMessage(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton : true
    });
    toast.present();
  }
}
