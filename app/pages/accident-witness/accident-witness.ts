import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {HomePage} from '../home/home'

/*
  Generated class for the AccidentWitnessPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-witness/accident-witness.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class AccidentWitnessPage {

  private programName: string = "Accident Witness";
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    });
  }

  loadingProgram(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading accident basic information metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setProgramMetadata(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  setProgramMetadata(programs){
    if(programs.length > 0){
      this.program = programs[0];
    }
    Geolocation.getCurrentPosition().then((resp) => {
      this.currentCoordinate = resp.coords;
      //alert(JSON.stringify(resp));
    });
    this.loadingData = false;
  }


  goToHome(){
    alert('dataValues :: ' + JSON.stringify(this.dataValues));
    this.navCtrl.setRoot(HomePage);
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
