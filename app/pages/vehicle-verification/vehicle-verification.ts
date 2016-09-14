import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {EventProvider} from "../../providers/event-provider/event-provider";

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
  private relationDataElement : any;
  private currentUser :any = {};
  private program : any ={};
  private dataElementListObject : any = {};

  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    })
  }

  verifyVehicle(){

    if(this.vehicle.plateNumber && this.relationDataElement.id){
      this.vehicle.plateNumber = this.vehicle.plateNumber.toUpperCase();
      if(this.vehicle.plateNumber.length == 7){
        this.vehicle.plateNumber =  this.vehicle.plateNumber.substr(0,4) + ' ' +this.vehicle.plateNumber.substr(4);
      }
      this.loadData();
    }else{
      this.setToasterMessage('Please enter Vehicle Plate Number');
    }
  }

  loadData(){
    this.eventProvider.findEventsByDataValue(this.relationDataElement.id,this.vehicle.plateNumber,this.program.id,this.currentUser).then(events=>{
      this.vehicle.events = events[0];
      alert(JSON.stringify(events));
    },error=>{
      alert('fail');
      alert(JSON.stringify(error));
    })
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
        this.dataElementListObject[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name;
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
