import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {AccidentBasicInformationPage} from '../accident-basic-information/accident-basic-information';

/*
 Generated class for the ReportAccidentPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'build/pages/report-accident/report-accident.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class ReportAccidentPage {

  public mediaData : string;

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {

  }

  takePhoto(){
    let options = {
      destinationType : Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.CAMERA
    };
    Camera.getPicture(options).then((imageData) => {
      this.mediaData = imageData;
      this.setToasterMessage('Photo has been taken successfully');
    }, () => {
      this.setStickToasterMessage('Fail to take a photo');
    });

  }

  pickPhotoFromGallery(){
    let options = {
      destinationType : Camera.DestinationType.NATIVE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    };
    Camera.getPicture(options).then((imageData) => {
      this.mediaData = imageData;
      this.setToasterMessage('Photo has been selected successfully');
    }, () => {
      this.setStickToasterMessage('Fail to take a photo');
    });
  }

  takeVideo(){
    this.setToasterMessage('This functionality is currently not supported');
  }

  goToAccidentBasicInformation(){
    this.navCtrl.push(AccidentBasicInformationPage);
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
