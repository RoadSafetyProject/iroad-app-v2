import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {EventProvider} from "../../providers/event-provider/event-provider";

import {ViewHistoricalRecordsPage} from '../view-historical-records/view-historical-records';

/*
  Generated class for the VehicleVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/vehicle-verification/vehicle-verification.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class VehicleVerificationPage {

  private vehicle : any ={};
  private programName: string = "Vehicle";
  private programAccidentVehicle :string = "Accident Vehicle";
  private programAccident : string = "Accident";
  private programOffenceEvent :string = "Offence Event";
  private programNameDataElementMapping : any = {};
  private relationDataElementPrefix : string = "Program_";

  private programNameProgramMapping : any = {};
  private accidentVehicleHistory : any = [];
  private offenceHistory : any = [];
  private relationDataElement : any;
  private currentUser :any = {};
  private program : any ={};
  private verificationData : any = [];
  private dataElementListObject : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];


  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    })
  }

  loadingProgram(){
    this.loadingData = true;
    this.loadingMessages = [];
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);

    this.setLoadingMessages('Loading Vehicle metadata');
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
      this.setLoadingMessages('Set Vehicle metadata');
      this.relationDataElement = {};
      this.program = programs[0];
      this.setRelationDataElement();
    }else{
      this.loadingData = false;
    }
  }

  setRelationDataElement(){
    if(this.program.programStages.length > 0){
      let relationDataElementCode = "id_"+this.programName;
      relationDataElementCode = relationDataElementCode.toLocaleLowerCase();
      this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
        this.dataElementListObject[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name,
          displayInReports : programStageDataElement.displayInReports,
          compulsory : programStageDataElement.compulsory
        };
        if(programStageDataElement.dataElement.code && programStageDataElement.dataElement.code.toLowerCase() ==relationDataElementCode){
          this.relationDataElement = programStageDataElement.dataElement;
        }
      });
      this.loadingAccidentMetadata();
    }
  }

  loadingAccidentMetadata(){
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programAccidentVehicle);

    this.setLoadingMessages('Loading accident vehicle Relation metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setProgramNameDataElementMapping(programs);
      this.loadingOffenseEventMeData();
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading accident vehicle Relation metadata " ;
      this.setStickToasterMessage(message);
    })
  }

  loadingOffenseEventMeData(){
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programOffenceEvent);

    this.setLoadingMessages('Loading offence Relation metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setProgramNameDataElementMapping(programs);
      this.loadingData = false;
    },error=>{
      this.loadingData= false;
      let message = "Fail to loading offence Relation metadata " ;
      this.setStickToasterMessage(message);
    })
  }

  setProgramNameDataElementMapping(programs){
    let programName = programs[0].name;
    this.programNameProgramMapping[programName] = programs[0].id;
    programs[0].programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if((this.relationDataElementPrefix+this.programName.replace(' ','_')).toLowerCase() == programStageDataElement.dataElement.name.toLowerCase()){
        this.programNameDataElementMapping[programName] = programStageDataElement.dataElement.id;
      }if((this.relationDataElementPrefix+this.programAccident.replace(' ','_')).toLowerCase() == programStageDataElement.dataElement.name.toLowerCase()){
        this.programNameDataElementMapping[this.programAccident] = programStageDataElement.dataElement.id;
      }
    });
  }

  verifyVehicle(){
    if(this.vehicle.plateNumber){
      this.vehicle.plateNumber = this.vehicle.plateNumber.toUpperCase();
      if(this.vehicle.plateNumber.length == 7){
        this.vehicle.plateNumber =  this.vehicle.plateNumber.substr(0,4) + ' ' + this.vehicle.plateNumber.substr(4);
      }
      this.verificationData = [];
      if(this.relationDataElement.id){
        this.loadData();
      }else{
        this.setToasterMessage('Fail to set relation data element ');
      }
    }else{
      this.setToasterMessage('Please enter Vehicle Plate Number');
    }
  }

  loadData(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Fetching vehicle information');
    this.eventProvider.findEventsByDataValue(this.relationDataElement.id,this.vehicle.plateNumber,this.program.id,this.currentUser).then(events=>{
      this.setLoadedData(events);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to verify, please your network connection');
    })
  }

  setLoadedData(events){
    if(events.length> 0){
      this.vehicle.events = events[0];
      this.verificationData = events[0].dataValues;
      this.loadingAccidentVehicleHistory();
    }else{
      this.loadingData = false;
      this.setToasterMessage('Vehicle does not exist in the system');
    }
  }

  loadingAccidentVehicleHistory(){
    this.setLoadingMessages('Loading accident history');
    let dataElementId = this.programNameDataElementMapping[this.programAccidentVehicle];
    let value = this.vehicle.events.event;
    let programId = this.programNameProgramMapping[this.programAccidentVehicle];
    this.eventProvider.findEventsByDataValue(dataElementId,value,programId,this.currentUser).then(events=>{
      this.setAccidentVehicleHistory(events);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load accident history');
    })

  }
  setAccidentVehicleHistory(events){
    this.accidentVehicleHistory = events;
    this.loadingOffenceHistory();
  }

  loadingOffenceHistory(){
    this.setLoadingMessages('Loading offence history');
    let dataElementId = this.programNameDataElementMapping[this.programOffenceEvent];
    let value = this.vehicle.events.event;
    let programId = this.programNameProgramMapping[this.programOffenceEvent];
    this.eventProvider.findEventsByDataValue(dataElementId,value,programId,this.currentUser).then(events=>{
      this.setOffenceHistory(events);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load accident history');
    })

  }

  setOffenceHistory(events){
    this.offenceHistory = events;
    this.loadingData = false;
  }

  ViewHistoricalRecords(nameOfHistoricalRecords){
    let  title= "";
    let historicalRecordsIds = [];
    if(nameOfHistoricalRecords == this.programAccident){
      let dataElementId = this.programNameDataElementMapping[nameOfHistoricalRecords];
      title = "List of Accidents";
      this.accidentVehicleHistory.forEach(accidentVehicle=>{
        accidentVehicle.dataValues.forEach(dataValue=>{
          if(dataValue.dataElement == dataElementId){
            historicalRecordsIds.push(dataValue.value);
          }
        });
      })
    }else if(nameOfHistoricalRecords == this.programOffenceEvent){
      title = "List Of Offence";
      this.offenceHistory.forEach(offence=>{
        historicalRecordsIds.push(offence.event);
      });
    }
    let parameter = {
      programName : nameOfHistoricalRecords,
      nameOfHistoricalRecords : title,
      historicalRecordsIds : historicalRecordsIds
    };
    this.navCtrl.push(ViewHistoricalRecordsPage,parameter);
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
