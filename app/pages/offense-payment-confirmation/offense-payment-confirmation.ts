import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {OffensePaymentCodePage} from "../offense-payment-code/offense-payment-code";

/*
  Generated class for the OffensePaymentConfirmationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offense-payment-confirmation/offense-payment-confirmation.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class OffensePaymentConfirmationPage {

  private offenceId : string;
  private offenceListIds : any = [];
  private programOffenceRegistry :string = 'Offence Registry';
  private offenceListDisplayName = "Nature";
  private offenceListCost = "Amount";
  private offenceListDisplayNameToDataElement : any = {};
  private selectedOffences :any;
  private selectedOffencesTotal : number;
  private currentUser :any = {};
  private program : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  constructor(private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.offenceId = this.params.get('offenceId');
      this.offenceListIds = this.params.get('offenceListId');
      this.loadingOffenceRegistryProgram();
    });
  }

  loadingOffenceRegistryProgram(){
    this.loadingData = true;
    this.setLoadingMessages('Loading offence List metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programOffenceRegistry);
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then(programs=>{
      this.setOffenceRegistryProgram(programs);
    },error=>{
      this.setToasterMessage('Fail to load offence list metadata');
      this.loadingData = false;
    })
  }

  setOffenceRegistryProgram(programs){
    this.program = programs[0];
    programs[0].programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name.toLowerCase() == this.offenceListDisplayName.toLowerCase()){
        this.offenceListDisplayNameToDataElement[this.offenceListDisplayName] = programStageDataElement.dataElement.id;
      }
      if(programStageDataElement.dataElement.name.toLowerCase() == this.offenceListCost.toLowerCase()){
        this.offenceListDisplayNameToDataElement[this.offenceListCost] = programStageDataElement.dataElement.id;
      }
    });
    this.loadSelectedOffences();
    }

  loadSelectedOffences(){
    this.setLoadingMessages('Loading selected offence(s) list from local storage');
    let resource = 'events';
    let attribute = 'event';
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,this.offenceListIds,this.currentUser.currentDatabase).then(events=>{
      this.setSelectedOffences(events);
    },error=>{
      this.setToasterMessage('Fail to load offence list metadata');
      this.loadingData = false;
    })
  }

  setSelectedOffences(events){
    this.selectedOffences = [];
    this.selectedOffencesTotal = 0;
    events.forEach(event=>{
      let offence = "";
      let cost = "";
      event.dataValues.forEach(dataValue=>{
        if(dataValue.dataElement == this.offenceListDisplayNameToDataElement[this.offenceListCost]){
          cost = dataValue.value;
          this.selectedOffencesTotal += parseInt(cost);
        }else if(dataValue.dataElement == this.offenceListDisplayNameToDataElement[this.offenceListDisplayName]){
          offence = dataValue.value;
        }
      });
      this.selectedOffences.push({
        offence : offence,
        cost : cost
      });
    });
    this.loadingData = false;
  }

  goToOffensePaymentCode(){
    this.setToasterMessage('Pay later with code code');
    //this.navCtrl.push(OffensePaymentCodePage);
  }

  goToOffensePayment(){
    this.setToasterMessage('Pay now');
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
