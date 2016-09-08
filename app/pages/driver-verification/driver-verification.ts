import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

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
    BarcodeScanner.scan().then((barcodeData) => {
      this.driver.driverLisence=barcodeData.text;
      this.loadData();
    }, () => {
      this.setStickToasterMessage('Fail to scan barcode');
    });
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
