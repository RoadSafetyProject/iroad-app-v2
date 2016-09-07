import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

/*
  Generated class for the DriverVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/driver-verification/driver-verification.html',
})
export class DriverVerificationPage {

  private driver : any ={};

  constructor(private navCtrl: NavController,private toastCtrl: ToastController) {

  }

  scanBarcode(){
    console.log('Hello, scan licence');
    this.driver.driverLisence="41000034995";
    this.loadData();

  }

  verifyDriver(){
    if(this.driver.driverLisence){
      console.log('Hello, verify driver licence');
      this.loadData();
    }else{
      this.setToasterMessage('Please enter driver licence');
    }
  }

  loadData(){
    this.driver.response ={
      name: "Joseph Chingalo",
      licenceNumber : this.driver.driverLisence,
      date : '2016-06-07'
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
