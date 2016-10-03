import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {AccidentVehiclePage} from '../accident-vehicle/accident-vehicle';
import {EventProvider} from "../../providers/event-provider/event-provider";

declare var SignaturePad: any;

/*
  Generated class for the AccidentBasicInformationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-basic-information/accident-basic-information.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class AccidentBasicInformationPage {

  private programName: string = "Accident";
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  private signaturePad : any;
  private signatureDataElement : any = {
    name : "Signature",
    id : "",
    imageData : "",
    value : ""
  };

  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
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
      this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
        if(programStageDataElement.dataElement.name.toLowerCase() == this.signatureDataElement.name.toLocaleLowerCase()){
          this.signatureDataElement.id = programStageDataElement.dataElement.id;
        }
      })
    }
    this.setGeoLocation();
    this.loadingData = false;
  }

  initiateSignaturePad(){
    let canvas = document.getElementById('signatureCanvas');
    this.signaturePad = new SignaturePad(canvas);
  }

  saveSignaturePad(){
    this.signatureDataElement.imageData= this.signaturePad.toDataURL();
  }

  uploadFIleServer(){
    //@todo uploading signature
    this.formatDataValues();
  }

  prepareToSaveBasicInformation(){
    this.loadingData = true;
    this.loadingMessages = [];
    if(this.signatureDataElement.imageData){
      this.setLoadingMessages('Uploading Signature');
      this.uploadFIleServer();
    }else {
      this.formatDataValues();
    }
  }



  formatDataValues(){
    //@todo checking for required fields
    this.setLoadingMessages('Preparing accident basic information');
    this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues,this.program,this.currentUser,this.currentCoordinate).then(event=>{
      this.setLoadingMessages('Saving accident basic information');
      this.eventProvider.saveEvent(event,this.currentUser).then(result=>{
        this.goToAccidentVehicle(result);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to save accident basic information');
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to prepare accident basic information');
    });let parameter = {
      accidentId : eventId
    };
    this.loadingData = false;
    this.navCtrl.push(AccidentVehiclePage,parameter);
  }

  goToAccidentVehicle(result){
    let eventId = result.response.importSummaries[0].reference;
    let parameter = {
      accidentId : eventId
    };
    this.loadingData = false;
    this.navCtrl.push(AccidentVehiclePage,parameter);
  }

  setLoadingMessages(message){
    this.loadingMessages.push(message);
  }

  setGeoLocation(){
    Geolocation.getCurrentPosition().then((resp) => {
      if(resp.coords.latitude){
        this.currentCoordinate.latitude = resp.coords.latitude;
      }else{
        this.currentCoordinate.latitude = '0';
      }
      if(resp.coords.longitude){
        this.currentCoordinate.longitude = resp.coords.longitude;
      }else{
        this.currentCoordinate.longitude = '0';
      }
    });
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
