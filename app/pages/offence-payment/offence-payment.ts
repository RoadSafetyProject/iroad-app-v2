import { Component } from '@angular/core';
import { NavController,ToastController,NavParams } from 'ionic-angular';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";

import {OffensePaymentCodePage} from "../offense-payment-code/offense-payment-code";

/*
  Generated class for the OffencePaymentPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/offence-payment/offence-payment.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class OffencePaymentPage {

  private offenceId : string;
  private offenceListIds : any = [];
  private programPaymentReceipt : string = 'Payment Receipt';
  private programOffenceEvent :string = 'Offence Event';
  private relationDataElementPrefix : string = "Program_";
  private relationDataElements:any = {};
  private currentUser :any = {};
  private program : any = {};
  private dataValues : any = {};
  private loadingData : boolean = false;
  private loadingMessages : any = [];

  //@todo incorporate Transaction Number and Reference Number
  //@todo send sms to driver or vehicle's owner mobile number


  constructor(private params: NavParams,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.offenceId = this.params.get('offenceId');
    this.offenceListIds = this.params.get('offenceListId');
    this.loadingPaymentReceipt();
  }

  loadingPaymentReceipt(){
    this.loadingData = true;
    this.setLoadingMessages('Loading payment receipt metadata');
    let resource = 'programs';
    let attribute = 'name';
    let attributeValue =[];
    attributeValue.push(this.programName);
  }

  setPaymentReceipt(programs){
    this.program = program[0];
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
