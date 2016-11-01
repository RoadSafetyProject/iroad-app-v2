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
  private programOffenceRegistryName: string = 'Offence Registry';
  private programOffence : any = {};
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
  private offenseListMetadataMapping : any = {};
  private relationDataElementPrefix : string = "Program_";
  private relationPrograms :any = {};
  private data : any = {};

  //driver
  //todo checking other values to be captures
  private mobileNumberDataElementName:any = "Phone Number";
  private driverFullName : string = "Full Name";
  private mobileNumberDataElement : any;
  private driverFullNameDataElement : any;
  private mobileNumber : string;
  private driverName : string;

  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.mobileNumber = "";
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
      this.loadingOffenceListMetadata();
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
      }else if(programStageDataElement.dataElement.valueType =='BOOLEAN'){
        this.dataValues[programStageDataElement.dataElement.id] = "false";
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
    programs[0].programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name.toLowerCase() == this.mobileNumberDataElementName.toLowerCase() ){
        this.mobileNumberDataElement = programStageDataElement.dataElement;
      }else if(programStageDataElement.dataElement.name.toLowerCase() == this.driverFullName.toLowerCase() ){
        this.driverFullNameDataElement = programStageDataElement.dataElement;
      }
    });
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

  loadingOffenceListMetadata(){
    this.setLoadingMessages('Loading Offence list metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push('Offence');

    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setOffenceListMetadata(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    });
  }

  setOffenceListMetadata(programs){
    this.programOffence = programs[0];
    programs[0].programStages[0].programStageDataElements.forEach(programStageDataElement =>{
      if(programStageDataElement.dataElement.name == 'Program_'+this.programName.replace(' ','_')){
        this.offenseListMetadataMapping[this.programName] = programStageDataElement.dataElement.id;
      }else if(programStageDataElement.dataElement.name == 'Program_'+this.programOffenceRegistryName.replace(' ','_')){
        this.offenseListMetadataMapping[this.programOffenceRegistryName] = programStageDataElement.dataElement.id;
      }
    });
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

  prepareSavingOffenceInformation(){
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
      events[0].dataValues.forEach((dataValue:any)=>{
        if(dataValue.dataElement == this.mobileNumberDataElement.id){
          this.mobileNumber = dataValue.value;
        }else if(dataValue.dataElement == this.driverFullNameDataElement.id){
          this.driverName = dataValue.value;
        }
      });
      let parameters = {
        offenceId: 'eventId',
        mobileNumber: this.mobileNumber,
        driverName: this.driverName,
        offenceListId: this.selectedOffenses
      };
      this.loadingData = false;
      this.navCtrl.push(OffensePaymentConfirmationPage,parameters);

      //this.fetchingVehicle();
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

  //@todo checking for required fields
  setVehicleDataValue(events,programName){
    if(events.length > 0){
      let relationDataElementId  = this.relationDataElementProgramMapping[programName];
      this.dataValues[relationDataElementId] = events[0].event;
      this.setLoadingMessages('Prepare offence information to save');
      this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues,this.program,this.currentUser,this.currentCoordinate).then(event=>{
        this.setLoadingMessages('Saving offence information');
        this.eventProvider.saveEvent(event,this.currentUser).then(result=>{
          this.prepareSavingOffenceList(result);
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

  prepareSavingOffenceList(result){
    let eventId = result.response.importSummaries[0].reference;
    let dataValuesArray = [];
    this.selectedOffenses.forEach(offenseId=>{
      let dataValue = {};
      dataValue[this.offenseListMetadataMapping[this.programOffenceRegistryName]] = offenseId;
      dataValue[this.offenseListMetadataMapping[this.programName]] = eventId;
      dataValuesArray.push(dataValue);
    });

    this.setLoadingMessages('Prepare Offence list information');
    this.eventProvider.getFormattedDataValuesArrayToEventObjectList(dataValuesArray,this.programOffence,this.currentUser).then(eventList=>{
      this.setLoadingMessages('Saving Offence list information');
      this.eventProvider.saveEventList(eventList,this.currentUser).then(()=>{
        this.goToOffensePaymentConfirmation(eventId);
      },()=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to save offense list information');
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to prepare offense list information');
    });

  }

  goToOffensePaymentConfirmation(eventId){
    let parameters = {
      offenceId : eventId,
      mobileNumber : this.mobileNumber,
      driverName: this.driverName,
      offenceListId : this.selectedOffenses
    };
    this.loadingData = false;
    this.navCtrl.push(OffensePaymentConfirmationPage,parameters);
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
