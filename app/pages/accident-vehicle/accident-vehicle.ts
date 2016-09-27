import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { Geolocation } from 'ionic-native';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {AccidentWitnessPage} from '../accident-witness/accident-witness'
import {EventProvider} from "../../providers/event-provider/event-provider";

/*
  Generated class for the AccidentVehiclePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/accident-vehicle/accident-vehicle.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
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
  private programDriverName :string = 'Driver';
  private programDriver : any  = {};
  private programVehicle : any = {};
  private driversObjectData : any = [];
  private vehiclesObjectData : any = [];
  private dataElementDriverId : string;
  private dataElementVehicleId : string;
  private programVehicleName : string = 'Vehicle';
  private programAccident : string = 'Accident';

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
      if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programDriverName.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programNameRelationDataElementMapping[this.programDriverName] = programStageDataElement.dataElement.id;

      }else if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programVehicleName.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programNameRelationDataElementMapping[this.programVehicleName] = programStageDataElement.dataElement.id;

      }else if(dataElementName.toLowerCase() == (this.relationDataElementPrefix + this.programAccident.replace(' ','_')).toLowerCase()){
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          name : programStageDataElement.dataElement.name
        };
        this.programAccidentId = programStageDataElement.dataElement.id;
      }
    });
    this.loadDriverMetadata();
  }

  loadDriverMetadata(){
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programDriverName);

    this.setLoadingMessages('Loading driver metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setLoadingMessages('Setting driver metadata');
      this.setDriverMetadata(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  setDriverMetadata(programs){
    this.programDriver = programs[0];
    this.dataElementDriverId = this.eventProvider.getRelationDataElementIdForSqlView(this.programDriver.programStages[0].programStageDataElements,this.programDriverName);
    this.loadVehicleMetadata();
  }

  loadVehicleMetadata(){
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programVehicleName);

    this.setLoadingMessages('Loading vehicle metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setLoadingMessages('Setting vehicle metadata');
      this.setVehicleMetadata(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  setVehicleMetadata(programs){
    this.programVehicle = programs[0];
    this.dataElementVehicleId = this.eventProvider.getRelationDataElementIdForSqlView(this.programVehicle.programStages[0].programStageDataElements,this.programVehicleName);
    this.addVehicle();
    this.loadingData = false;
  }

  addVehicle(){
    let dataValue = {};
    dataValue[this.programAccidentId] = this.accidentId;
    this.dataValuesArray.push(dataValue);
    this.currentVehicle = "" + (this.dataValuesArray.length - 1);
  }

  removeVehicle(vehicleIndex){
    this.dataValuesArray.splice(vehicleIndex, 1);
    if(this.dataValuesArray.length == 1){
      this.currentVehicle = "0";
    }else if(parseInt(this.currentVehicle) == this.dataValuesArray.length){
      this.currentVehicle = "" + (this.dataValuesArray.length - 1);
    }else{
      this.currentVehicle = "" + (vehicleIndex - 1);
    }
  }

  showSegment(vehicleIndex){
    this.currentVehicle = "" + vehicleIndex;
  }

  prepareToSaveAccidentVehicle(){
    this.loadingData = true;
    this.loadingMessages = [];
    this.setLoadingMessages('Preparing accident vehicle information');
    let dataValuesArrayList = [];
    this.dataValuesArray.forEach((dataValues:any,index : any)=>{
      if(Object.keys(dataValues).length > 1){
        if(this.hasVehiclePlateNumberAndDriverLicence(dataValues,index)){
          dataValuesArrayList.push(dataValues);
        }
      }
    });
    if(dataValuesArrayList.length == this.dataValuesArray.length ){
      this.fetchingDrivers();
    }else{
      this.loadingData = false;
    }

  }

  hasVehiclePlateNumberAndDriverLicence(dataValues,index){
    let result = true;
    if(!dataValues[this.dataElementDriverId]){
      this.setToasterMessage('Please enter driver licence for vehicle ' + (index +1));
      result = false;
    }else if(!dataValues[this.dataElementVehicleId]){
      this.setToasterMessage('Please enter vehicle plate number for vehicle ' + (index +1));
      result = false;
    }
    return result;
  }

  fetchingDrivers(){
    this.setLoadingMessages("Fetching driver's information");
    let driverLicenceId = this.programNameRelationDataElementMapping[this.programDriverName];
    this.driversObjectData = [];
    this.dataValuesArray.forEach(dataValues=>{
      if(dataValues[this.dataElementDriverId]){
        this.driversObjectData.push({
          dataElementId : this.dataElementDriverId,
          driverLicenceId : driverLicenceId,
          value : dataValues[this.dataElementDriverId],
          eventData : []
        })
      }
    });
    this.eventProvider.findAndSetEventsToRelationDataValuesList(this.driversObjectData,this.programDriver.id,this.currentUser).then(RelationDataValuesList=>{
      this.setLoadingMessages("Setting driver's information");
      this.setDrivers(RelationDataValuesList);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage("Fail to fetch driver's information ");
    });
  }

  setDrivers(RelationDataValuesList){
    let shouldContinue = true;
    RelationDataValuesList.forEach((dataValues:any,index:any)=>{
      if(dataValues.eventData.length == 0){
        shouldContinue = false;
        this.setToasterMessage('Driver licence for vehicle ' + (index + 1) + ' has not found');
      }
    });
    if(shouldContinue){
      this.driversObjectData = RelationDataValuesList;
      this.fetchingVehicles();
    }else{
      this.loadingData = false;
    }
  }

  fetchingVehicles(){
    this.setLoadingMessages("Fetching vehicle's information");
    let vehiclePlateNumberId = this.programNameRelationDataElementMapping[this.programVehicleName];
    this.vehiclesObjectData = [];
    this.dataValuesArray.forEach(dataValues=>{
      if(dataValues[this.dataElementVehicleId]){
        let plateNumber = dataValues[this.dataElementVehicleId].toUpperCase();
        if(plateNumber.length == 7){
          plateNumber =  plateNumber.substr(0,4) + ' ' + plateNumber.substr(4);
        }
        dataValues[this.dataElementVehicleId] = plateNumber;
        this.vehiclesObjectData.push({
          dataElementId : this.dataElementVehicleId,
          vehiclePlateNumberId: vehiclePlateNumberId,
          value : plateNumber,
          eventData : []
        })
      }
    });

    this.eventProvider.findAndSetEventsToRelationDataValuesList(this.vehiclesObjectData,this.programVehicle.id,this.currentUser).then(RelationDataValuesList=>{
      this.setLoadingMessages("Setting vehicle's information");
      this.setVehicles(RelationDataValuesList);
    },error=>{
      this.setToasterMessage("Fail to fetch vehicle's information");
      this.loadingData = false;
    });
  }

  setVehicles(RelationDataValuesList){
    let shouldContinue = true;
    RelationDataValuesList.forEach((dataValues:any,index:any)=>{
      if(dataValues.eventData == 0){
        shouldContinue = false;
        this.setToasterMessage('Vehicle plate number for vehicle ' + (index + 1) + ' has not found');
      }
    });
    if(shouldContinue){
      this.vehiclesObjectData = RelationDataValuesList;
      this.setAndSaveAccidentVehiclesInformation();

    }else{
      this.loadingData = false;
    }
  }

  //@todo checking for required fields
  setAndSaveAccidentVehiclesInformation(){
    let newDataValuesArray = [];
    this.setLoadingMessages('Setting accident vehicle information');
    let driverLicenceId = this.programNameRelationDataElementMapping[this.programDriverName];
    let vehiclePlateNumberId = this.programNameRelationDataElementMapping[this.programVehicleName];
    this.dataValuesArray.forEach((dataValues:any,index:any)=>{
      newDataValuesArray.push(dataValues);
      newDataValuesArray[index][driverLicenceId] = this.driversObjectData[index].eventData[0].event;
      newDataValuesArray[index][vehiclePlateNumberId] = this.vehiclesObjectData[index].eventData[0].event;
    });

    this.eventProvider.getFormattedDataValuesArrayToEventObjectList(this.dataValuesArray,this.program,this.currentUser).then(eventList=>{
      this.setLoadingMessages('Saving accident vehicle information');
      this.eventProvider.saveEventList(eventList,this.currentUser).then(result=>{
        let parameter = {
          accidentId : this.accidentId
        };
        this.setToasterMessage('Accident Vehicles has been saved successfully');
        this.loadingData = false;
        this.navCtrl.push(AccidentWitnessPage,parameter);
      },error=>{
        this.setToasterMessage('Fail to save accident vehicle information');
        this.loadingData = false;
      });
    },error=>{
      this.setToasterMessage('Fail to set accident vehicle information');
      this.loadingData = false;
    });
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
