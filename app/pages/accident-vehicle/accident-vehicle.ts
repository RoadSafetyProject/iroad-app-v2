import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {AccidentWitnessPage} from '../accident-witness/accident-witness'

/*
  Generated class for the AccidentVehiclePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-vehicle/accident-vehicle.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class AccidentVehiclePage {

  private programName: string = "Accident Vehicle";
  private currentUser :any = {};
  private program : any = {};
  //private dataValues : any = {};
  private dataValuesArray : any = [];
  private data :any = [];
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  private accidentId :string;
  private currentVehicle :string = "0";
  private relationDataElements : any = {};
  private programNameRelationDataElementMapping :any = {};
  private relationDataElementPrefix : string = "Program_";
  private programAccidentId :string ;
  private programDriver :string = 'Driver';
  private programVehicle : string = 'Vehicle';
  private programAccident : string = 'Accident';

  constructor(private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.accidentId = this.params.get('accidentId');
      this.loadingProgram();
    });
  }

  loadingProgram(){
    this.loadingData = true;
    this.loadingMessages = [];
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);

    this.setLoadingMessages('Loading accident vehicle metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setLoadingMessages('Setting accident vehicle metadata');
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
      this.setGeoLocation();
      this.setAndCheckingForRelationMetaData();
    }else{
      this.loadingData = false;
    }
  }

  setAndCheckingForRelationMetaData(){
    this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      let dataElementName = programStageDataElement.dataElement.name;
      if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programDriver.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programNameRelationDataElementMapping[this.programDriver] = programStageDataElement.dataElement.id;

      }else if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programVehicle.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programNameRelationDataElementMapping[this.programVehicle] = programStageDataElement.dataElement.id;

      }else if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programAccident.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programAccidentId = programStageDataElement.dataElement.id;
      }
    });
    this.addVehicle();
    this.loadingData = false;
  }

  addVehicle(){
    let dataValue = {};
    dataValue[this.programAccidentId] = this.accidentId;
    this.dataValuesArray.push(dataValue)
  }

  removeVehicle(vehicleIndex){
    this.dataValuesArray.splice(vehicleIndex, 1);
    if(this.dataValuesArray.length == 1){
      this.currentVehicle = "0";
    }else if(parseInt(this.currentVehicle) == this.dataValuesArray.length){
      this.currentVehicle = "" + (this.dataValuesArray.length - 1);
    }
  }

  showSegment(vehicleIndex){
    this.currentVehicle = "" + vehicleIndex;
  }

  goToAccidentWitness(){
    alert('dataValuesArray :: ' + JSON.stringify(this.dataValuesArray));
    let parameter = {
      accidentId : this.accidentId
    };
    alert(parameter);
    this.navCtrl.push(AccidentWitnessPage,parameter);
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
