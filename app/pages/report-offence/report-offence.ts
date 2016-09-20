import { Component } from '@angular/core';
import { NavController ,ToastController} from 'ionic-angular';
import {OffensePaymentConfirmationPage} from "../offense-payment-confirmation/offense-payment-confirmation";

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

/*
  Generated class for the ReportOffencePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/report-offence/report-offence.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class ReportOffencePage {

  private offenseList : any = [];
  private programName: string = "Offence Event";
  private offenceListDisplayName = "Nature";
  private offenseListCost = "Amount";
  private isOffenceDataElementToBeDisplayed : any = {};
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private selectedOffenses :any = [];
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private relationDataElements:any = {};
  private relationDataElementPrefix : string = "Program_";
  private data : any = {};

  constructor(private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    });
  }

  loadingProgram(){
    this.loadingData = true;
    this.setLoadingMessages('Loading offence metadata');
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
      this.checkingRelationDataElements();
      this.loadingOffenseRegistryProgram();
    }else{
      this.loadingData = false;
    }
  }

  checkingRelationDataElements(){
    this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name.startsWith(this.relationDataElementPrefix)){
        let programName = programStageDataElement.dataElement.name.replace(this.relationDataElementPrefix,"");
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          program : programName,
        }
      }
    });
    alert(JSON.stringify(this.relationDataElements));

  }


  loadingOffenseRegistryProgram(){
    this.setLoadingMessages('Loading offence(s) list metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push('Offence Registry');

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.getOffenceEventList(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  getOffenceEventList(programs){
    this.setLoadingMessages('Loading offence(s) list from local storage');
    let resource = 'events';
    let attribute = 'program';
    let attributeValue =[];
    attributeValue.push(programs[0].id);
    this.isOffenceDataElementToBeDisplayed = {};
    programs[0].programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name.toLowerCase() == this.offenceListDisplayName.toLowerCase()){
        this.isOffenceDataElementToBeDisplayed[programStageDataElement.dataElement.id] = true;
      }else{
        this.isOffenceDataElementToBeDisplayed[programStageDataElement.dataElement.id] = false;
      }
    });

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((offenceEventList)=>{
      this.setOffenceEventList(offenceEventList);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }


  setOffenceEventList(offenceEventList){
    this.loadingData = false;
    this.offenseList= [];
    offenceEventList.forEach(event=>{
      this.offenseList.push(event);
    });
    Geolocation.getCurrentPosition().then((resp) => {
      this.currentCoordinate = resp.coords;
      //alert(JSON.stringify(resp));
    });
  }

  goToOffensePaymentConfirmation(){
    if(this.selectedOffenses.length > 0){
      alert(JSON.stringify(this.data));
      //alert('selectedOffenses :: ' + JSON.stringify(this.selectedOffenses));
      //alert('dataValues :: ' + JSON.stringify(this.dataValues));
      //alert(JSON.stringify(this.currentCoordinate));
      //@todo saving offense as well as offence list
     // this.navCtrl.push(OffensePaymentConfirmationPage);
    }else{
      this.setToasterMessage('Please select at least one offence from offence list');
    }

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
