import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';

/*
  Generated class for the VehicleVerificationPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/vehicle-verification/vehicle-verification.html',
})
export class VehicleVerificationPage {

  private vehicle : any ={};

  constructor(private navCtrl: NavController,private toastCtrl: ToastController) {

  }

  verifyVehicle(){
    if(this.vehicle.plateNumber){
      console.log('Hello, verify driver licence');
      this.loadData();
    }else{
      this.setToasterMessage('Please enter Vehicle Plate Number');
    }
  }

  loadData(){
    this.vehicle.response ={
      owner: "Joseph Chingalo",
      plateNumber : this.vehicle.plateNumber,
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
