import { Component } from '@angular/core';
import { NavController ,ToastController} from 'ionic-angular';
import {OffensePaymentConfirmationPage} from "../offense-payment-confirmation/offense-payment-confirmation";

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {EventProvider} from "../../providers/event-provider/event-provider";

/*
 Generated class for the ReportOffencePage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'build/pages/report-offence/report-offence.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class ReportOffencePage {

  private offenseList : any = [];
  private programName: string = "Offence Event";
  private offenceListDisplayName = "Nature";
  private isOffenceDataElementToBeDisplayed : any = {};
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private selectedOffenses :any = [];
  private currentCoordinate : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private relationDataElements:any = {};
  private relationDataElementProgramMapping : any = {};
  private relationDataElementPrefix : string = "Program_";
  private relationPrograms :any = {};
  private data : any = {};

  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
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
    this.setGeoLocation();
    if(programs.length > 0){
      this.program = programs[0];
      this.checkAndSetRelationDataElements();
      this.loadingOffenseRegistryProgram();
    }else{
      this.loadingData = false;
    }
  }

  checkAndSetRelationDataElements(){
    let programNames = [];
    this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name.startsWith(this.relationDataElementPrefix)){
        let programName = programStageDataElement.dataElement.name.replace(this.relationDataElementPrefix,"");
        programNames.push(programName);
        this.relationDataElementProgramMapping[programName] = programStageDataElement.dataElement.id;
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          program : programName,
        }

      }
    });
    this.fetchingPrograms(programNames);
  }

  fetchingPrograms(programNames){
    this.relationPrograms = {};
    this.setLoadingMessages('Loading Relation programs metadata');
    programNames.forEach(programName=>{
      let resource = 'programs';
      let attribute = 'name';
      let attributeValue =[];
      attributeValue.push(programName);

      this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
        this.setRelationProgramMetadata(programs,programName);
      },error=>{
      })
    });
  }

  setRelationProgramMetadata(programs,programName){
    this.relationPrograms[programName] = programs[0];
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

  }

  goToOffensePaymentConfirmation(){
    if(this.selectedOffenses.length > 0){
      this.loadingData = true;
      this.loadingMessages = [];
      this.fetchingDriver();
    }else{
      this.setToasterMessage('Please select at least one offence from offence list');
    }
  }

  fetchingDriver(){
    if(this.data.licenceNumber){
      this.setLoadingMessages('Fetching driver information');
      let programName = 'Driver';
      let program = this.relationPrograms[programName];
      let relationDataElementId = this.eventProvider.getRelationDataElementIdForSqlView(program.programStages[0].programStageDataElements,programName);
      this.eventProvider.findEventsByDataValue(relationDataElementId,this.data.licenceNumber,program.id,this.currentUser).then(events=>{
        this.setDriverDataValue(events,programName);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to verify driver');
      });
    }else{
      this.loadingData = false;
      this.setToasterMessage('Please Enter Driver licence number');
    }
  }

  setDriverDataValue(events,programName){
    if(events.length > 0){
      let relationDataElementId  = this.relationDataElementProgramMapping[programName];
      this.dataValues[relationDataElementId] = events[0].event;
      this.fetchingVehicle();
    }else{
      this.loadingData = false;
      this.setToasterMessage('Driver has not found');
    }

  }

  fetchingVehicle(){
    if(this.data.plateNumber){
      this.setLoadingMessages('Fetching vehicle information');
      let programName = 'Vehicle';
      this.data.plateNumber = this.data.plateNumber.toUpperCase();
      if(this.data.plateNumber.length == 7){
        this.data.plateNumber =  this.data.plateNumber.substr(0,4) + ' ' + this.data.plateNumber.substr(4);
      }
      let program = this.relationPrograms[programName];
      let relationDataElementId = this.eventProvider.getRelationDataElementIdForSqlView(program.programStages[0].programStageDataElements,programName);
      this.eventProvider.findEventsByDataValue(relationDataElementId,this.data.plateNumber,program.id,this.currentUser).then(events=>{
        this.setVehicleDataValue(events,programName);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to verify vehicle');
      });
    }else{
      this.loadingData = false;
      this.setToasterMessage('Please Enter Vehicle plate number');
    }
  }

  setVehicleDataValue(events,programName){
    if(events.length > 0){
      let relationDataElementId  = this.relationDataElementProgramMapping[programName];
      this.dataValues[relationDataElementId] = events[0].event;
      this.setLoadingMessages('Prepare offence information to save');
      this.eventProvider.formatDataValuesToEventObject(this.dataValues,this.program,this.currentUser,this.currentCoordinate).then(event=>{
        this.setLoadingMessages('Saving offence information');
        this.eventProvider.saveEvent(event,this.currentUser).then(result=>{
          this.savingOffenceList(result);
        },error=>{
          this.loadingData = false;
          this.setToasterMessage('Fail to save offense information to the server')
        });
      });

    }else{
      this.loadingData = false;
      this.setToasterMessage('Vehicle has not found');
    }
  }

  savingOffenceList(result){
    this.loadingData = false;
    let eventId = result.response.importSummaries[0].reference;
    alert(eventId);
    //alert('selectedOffenses :: ' + JSON.stringify(this.selectedOffenses));
    //alert(JSON.stringify(this.currentCoordinate));
    //@todo saving offense as well as offence list
    // this.navCtrl.push(OffensePaymentConfirmationPage);

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
