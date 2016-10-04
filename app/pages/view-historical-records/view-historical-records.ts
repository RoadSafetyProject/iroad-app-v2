import { Component } from '@angular/core';
import {ToastController,NavParams } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";
import {EventProvider} from "../../providers/event-provider/event-provider";;

/*
 Generated class for the ViewHistoricalRecordsPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'build/pages/view-historical-records/view-historical-records.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class ViewHistoricalRecordsPage {

  private nameOfHistoricalRecords : string;
  private programName : string;
  private historicalRecordsIds :any = [];
  private historicalRecords :any [];
  private dataElementToDataElementNameMapping : any = {};
  private currentUser : any;
  private program : any;
  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private relationDataElementPrefix : string = "Program_";

  constructor(private params: NavParams,private eventProvider : EventProvider,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.nameOfHistoricalRecords = this.params.get('nameOfHistoricalRecords');
      this.historicalRecordsIds = this.params.get('historicalRecordsIds');
      this.programName = this.params.get('programName');
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

    this.setLoadingMessages('Loading '+this.programName +' metadata');
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then((programs)=>{
      this.setLoadingMessages('Setting '+this.programName +' metadata');
      this.setProgramMetadata(programs);
    },error=>{
      this.loadingData = false;
      let message = "Fail to loading programs " + error;
      this.setStickToasterMessage(message);
    })
  }

  //@todo get relation data values
  setProgramMetadata(programs){
    if(programs.length > 0){
      this.program = programs[0];
      this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
        if(programStageDataElement.displayInReports){
          if(!programStageDataElement.dataElement.name.startsWith(this.relationDataElementPrefix)){
            this.dataElementToDataElementNameMapping[programStageDataElement.dataElement.id] = programStageDataElement.dataElement.name;
          }else{
            //@todo get relation data values
          }
        }
      });
      this.loadingEventData();
    }else{
      this.loadingData = false;
      this.setToasterMessage('Fail to find '+this.programName +' metadata');
    }
  }

  loadingEventData(){
    this.setLoadingMessages('Loading '+this.nameOfHistoricalRecords);
    this.eventProvider.getEventByEventIds(this.historicalRecordsIds,this.program.id,this.currentUser).then(
      events=>{
        this.setEventData(events);
        this.loadingData = false;
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to load ' + this.nameOfHistoricalRecords);
      }
    );
  }

  setEventData(events){
    this.historicalRecords = events;
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
