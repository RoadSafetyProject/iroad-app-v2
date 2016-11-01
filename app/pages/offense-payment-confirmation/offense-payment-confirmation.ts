import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {HomePage} from "../home/home";
import {OffencePaymentPage} from '../offence-payment/offence-payment';

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

  private offenceId:string;
  private offenceListIds:any = [];
  private programOffenceRegistry:string = 'Offence Registry';
  private offenceListDisplayName:string = "Nature";
  private offenceListCost:string = "Amount";
  private offenceListDisplayNameToDataElement:any = {};
  private selectedOffences:any;
  private selectedOffencesTotal:number;
  private currentUser:any = {};
  private program:any = {};
  private loadingData:boolean = false;
  private loadingMessages:any = [];
  //@todo customization of offence notifications
  private offenceListCodesName:string = "offense code";
  private offenceListCodes:any = [];
  private offensePoints : any = {id : "",name : "Points",points : 0};


  //@todo send sms to driver or vehicle's owner mobile number
  private programEventRelation : any;
  private driverNumber : string;
  private driverName : string;
  constructor(private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.offenceId = this.params.get('offenceId');
      this.offenceListIds = this.params.get('offenceListId');
      this.programEventRelation = this.params.get('programEventRelation');
      this.driverNumber = this.params.get('mobileNumber');
      this.driverName = this.params.get('driverName');
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
      }else if(programStageDataElement.dataElement.name.toLowerCase() == this.offenceListCost.toLowerCase()){
        this.offenceListDisplayNameToDataElement[this.offenceListCost] = programStageDataElement.dataElement.id;
      }else if(programStageDataElement.dataElement.name.toLowerCase() == this.offenceListCodesName.toLowerCase()){
        this.offenceListDisplayNameToDataElement[this.offenceListCodesName] = programStageDataElement.dataElement.id;
      }else if(programStageDataElement.dataElement.name.toLowerCase() == this.offensePoints.name.toLowerCase() ){
        this.offensePoints.id = programStageDataElement.dataElement.id;
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

  //todo get driver information as well as vehicle information
  //@todo user programEventRelation = {programName ={event:eventId,program:programId}
  setSelectedOffences(events){
    this.selectedOffences = [];
    this.offenceListCodes = [];
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
        }else if (dataValue.dataElement == this.offenceListDisplayNameToDataElement[this.offenceListCodesName]){
          if(this.offenceListCodes.indexOf(dataValue.value) == -1){
            this.offenceListCodes.push(dataValue.value);
          }
        }else if(dataValue.dataElement == this.offensePoints.id){
          this.offensePoints.points += parseInt(dataValue.value);
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
    this.loadingData = true;
    this.loadingMessages = [];
    let message = this.getOffenseNotificationMessage();
    let number = '+255718922311';
    //let number = "+255764010449";
    if(this.driverNumber !=""){
      number = this.driverNumber;
    }
    this.setLoadingMessages('Sending message');
    this.app.sendSms(number,message).then(()=>{
      this.setToasterMessage('Payment details has been sent');
      this.loadingData = false;
      this.navCtrl.setRoot(HomePage);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to send payment details to '+number+',please try to resend');
    });

  }

  goToOffensePayment(){
    let parameters = {
      offenceId : this.offenceId,
      selectedOffences : this.selectedOffences
    };
    this.navCtrl.push(OffencePaymentPage,parameters);
  }

  getOffenseNotificationMessage(){
    this.setLoadingMessages('Composing message');
    let message = "OFFENCE NOTIFICATION\n Dear "+this.driverName+",you have committed "+this.selectedOffences.length +" offences in ";
    //add codes
    this.offenceListCodes.forEach((code : any,index:any)=>{
      message += (index + 1) + ". "+code + ", ";
    });
    let total = 0;
    this.selectedOffences.forEach(selectedOffence=>{
      total += parseInt(selectedOffence.cost);
    });
    message +='Total cost Tsh ' + total + '. ';
    message +='Payment code is ' + this.offenceId;
    return message;
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
