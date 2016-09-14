import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the DriverVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/driver-verification/driver-verification.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class DriverVerificationPage {

  private driver : any ={};
  private programName: string = "Driver";
  private relationDataElement : any;
  private currentUser :any = {};
  private program : any ={};

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    })
  }

  scanBarcode(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.driver.driverLisence=barcodeData.text;
      this.loadData();
    }, () => {
      this.setStickToasterMessage('Fail to scan barcode');
    });
  }

  verifyDriver(){
    if(this.driver.driverLisence){
      console.log('Hello, verify driver licence');
      this.loadData();
    }else{
      this.setToasterMessage('Please enter driver licence');
    }
  }

  loadData(){
    this.driver.response ={
      name: "Joseph Chingalo",
      licenceNumber : this.driver.driverLisence,
      date : '2016-06-07'
    }
  }

  loadingProgram(){
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setProgramMetadata(programs);
    },error=>{
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  setProgramMetadata(programs){
    if(programs.length > 0){
      this.relationDataElement = {};
      this.program = programs[0];
      this.setRelationDataElement();
    }
  }

  setRelationDataElement(){
    if(this.program.programStages.length > 0){
      let relationDataElementCode = "id_"+this.programName;
      relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
      this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
        if(programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() ==relationDataElementCode){
          this.relationDataElement = programStageDataElement.dataElement;
        }
      })
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
