import { Component } from '@angular/core';
import { NavController,Storage, LocalStorage } from 'ionic-angular';

import {HttpClient} from '../../providers/http-client/http-client';
import {User } from '../../providers/user/user';

/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/home/home.html',
  providers : [HttpClient,User]
})
export class HomePage {

  private localStorage : any;
  constructor(private navCtrl: NavController,private httpClient:HttpClient,private user : User) {
    this.localStorage = new Storage(LocalStorage);
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.user.getCurrentUser().then(user=>{
      console.log(user);
    })
  }

}
