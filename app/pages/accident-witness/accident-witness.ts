import { Component } from '@angular/core';
import { NavController,ToastController ,NavParams} from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {HomePage} from '../home/home'

import {EventProvider} from "../../providers/event-provider/event-provider";

/*
  Generated class for the AccidentWitnessPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-witness/accident-witness.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class AccidentWitnessPage {

  private programName: string = "Accident Witness";
  private currentUser :any = {};
  private program : any = {};
  private dataValuesArray : any = [];
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  private accidentId :string;
  private currentWitness : string = "0";
  private relationDataElements : any = {};
  private relationDataElementPrefix : string = "Program_";
  private programAccident : string = 'Accident';
  private programAccidentId :string ;

  constructor(private eventProvider : EventProvider,private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.accidentId = this.params.get('accidentId');
      this.loadingProgram();
    });
  }

  loadingProgram(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Loading accident witness metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setLoadingMessages('Setting accident witness metadata');
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
      if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programAccident.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programAccidentId = programStageDataElement.dataElement.id;
      }
    });
    this.addWitness();
    this.loadingData = false;
  }

  addWitness(){
    let dataValue = {};
    dataValue[this.programAccidentId] = this.accidentId;
    this.dataValuesArray.push(dataValue)
  }

  removeWitness(witnessIndex){
    this.dataValuesArray.splice(witnessIndex, 1);
    if(this.dataValuesArray.length == 1){
      this.currentWitness = "0";
    }else if(parseInt(this.currentWitness) == this.dataValuesArray.length){
      this.currentWitness = "" + (this.dataValuesArray.length - 1);
    }else{
      this.currentWitness = "" + (witnessIndex - 1);
    }
  }

  showSegment(witnessIndex){
    this.currentWitness = "" + witnessIndex;
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

  //@todo checking for required fields
  prepareToSaveAccidentWitness(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Preparing to accident witness information');
    let dataValuesArrayList = [];
    this.dataValuesArray.forEach(dataValues=>{
      if(Object.keys(dataValues).length > 1){
        dataValuesArrayList.push(dataValues);
      }
    });
    this.eventProvider.getFormattedDataValuesArrayToEventObjectList(dataValuesArrayList,this.program,this.currentUser).then(eventList=>{
      this.setLoadingMessages('Saving accident witness information');
      this.eventProvider.saveEventList(eventList,this.currentUser).then(result=>{
        this.setToasterMessage('Accident witness information has been saved successfully');
        this.navCtrl.setRoot(HomePage);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to save accident witness information');
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to prepare accident witness information');
    });
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
