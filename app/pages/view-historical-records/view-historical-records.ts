import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

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
  private historicalRecordsIds :any = [];
  private historicaalRecords :any [];
  private currentUser : any;
  private programId : string;

  constructor(private eventProvider : EventProvider,private navCtrl: NavController,private toastCtrl: ToastController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App) {
    this.user.getCurrentUser().then(currentUser=>{
      this.currentUser = JSON.parse(currentUser);
      this.loadingProgram();
    })
  }

}
