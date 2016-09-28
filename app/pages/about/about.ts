import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import {App} from "../../providers/app/app";
import {HttpClient} from "../../providers/http-client/http-client";
import {User} from "../../providers/user/user";
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import { AppVersion } from 'ionic-native';
import {Keys} from '../../pipes/keys'

/*
  Generated class for the AboutPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/about/about.html',
  providers: [App,HttpClient,User,SqlLite],
  pipes : [Keys]
})
export class AboutPage {

  private currentUser : any;
  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private systemInformation : any;
  private appInformation : any;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingSystemInformation();
    });
  }

  loadingSystemInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading system information');
    this.user.getUserSystemInformation().then(systemInformation=>{
      this.systemInformation = JSON.parse(systemInformation);
      this.loadAppInformation();
    });
  }

  loadAppInformation(){
    this.setLoadingMessages('Loading app information');
    this.user.getAppInformation().then(appInformation=>{
      this.appInformation = appInformation;
      this.loadingStorageStatus();
    })
  }



  loadingStorageStatus(){
    this.loadingData = false;
    //this.app.getStorageStatus(this.currentUser.currentDatabase).then(status=>{
    //  alert(JSON.stringify(status));
    //  this.loadingData = false;
    //},error=>{
    //  alert('Fails');
    //  this.loadingData = false;
    //});
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
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
