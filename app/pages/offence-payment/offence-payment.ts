import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {HomePage} from "../home/home";
import {EventProvider} from "../../providers/event-provider/event-provider";
/*
  Generated class for the OffencePaymentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offence-payment/offence-payment.html',
  providers: [App,HttpClient,User,SqlLite,EventProvider]
})
export class OffencePaymentPage {

  private offenceId : string;
  private programPaymentReceipt : string = 'Payment Receipt';
  private programOffenceEvent :string = 'Offence Event';
  private relationDataElementPrefix : string = "Program_";
  private paymentAmountName :string = "Amount";
  private relationDataElements:any = {};
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];
  private selectedOffences :any;

  //@todo incorporate Transaction Number and Reference Number

  constructor(private eventProvider : EventProvider,private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.offenceId = this.params.get('offenceId');
    this.selectedOffences = this.params.get('selectedOffences');
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingPaymentReceipt();
    });
  }

  loadingPaymentReceipt(){
    this.loadingData = true;
    this.setLoadingMessages('Loading payment receipt metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programPaymentReceipt);
    this.sqlLite.getDataFromTableByAttributes(resource,attribute,attributeValue,this.currentUser.currentDatabase).then(programs=>{
      this.setPaymentReceipt(programs);
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to load payment receipt metadata');
    })
  }

  setPaymentReceipt(programs){
    this.program = programs[0];
    this.checkAndSetRelationData();
  }

  checkAndSetRelationData(){
    this.setLoadingMessages('Checking for relation metadata');
    this.program.programStages[0].programStageDataElements.forEach(programStageDataElement=>{
      if(programStageDataElement.dataElement.name == this.paymentAmountName){
        let total = 0;
        this.selectedOffences.forEach(selectedOffence=>{
          total += parseInt(selectedOffence.cost);
        });
        this.dataValues[programStageDataElement.dataElement.id] = total;
      }else if(programStageDataElement.dataElement.name.toLowerCase() == (this.relationDataElementPrefix + this.programOffenceEvent.replace(' ','_')).toLowerCase()){
        this.dataValues[programStageDataElement.dataElement.id] = this.offenceId;
        this.relationDataElements[programStageDataElement.dataElement.id] = {
          program : this.programOffenceEvent
        }
      }
    });
    this.loadingData = false;
  }

  //@todo checking for required fields
  savePayment(){
    this.loadingData = true;
    this.loadingMessages = [];
    let currentCoordinate = {
      latitude : '0',
      longitude : '0'
    };
    this.setLoadingMessages('Preparing payment information for saving');
    this.eventProvider.getFormattedDataValuesToEventObject(this.dataValues,this.program,this.currentUser,currentCoordinate).then(event=>{
      this.setLoadingMessages('Saving payment information');
      this.eventProvider.saveEvent(event,this.currentUser).then(result=>{
        this.loadingData = false;
        this.setToasterMessage('Payment information has been saved successfully');
        this.navCtrl.setRoot(HomePage);
      },error=>{
        this.loadingData = false;
        this.setToasterMessage('Fail to prepare payment information')
      });
    },error=>{
      this.loadingData = false;
      this.setToasterMessage('Fail to prepare payment information')
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
