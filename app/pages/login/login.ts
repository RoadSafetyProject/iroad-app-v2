import { Component } from '@angular/core';
import { NavController ,ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { App } from '../../providers/app/app';
import {User } from '../../providers/user/user';
import {HttpClient} from '../../providers/http-client/http-client';
import {SqlLite} from "../../providers/sql-lite/sql-lite";


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [App,HttpClient,User,SqlLite]
})
export class LoginPage {

  private loginData : any ={};

  constructor(private navCtrl: NavController,private sqlLite : SqlLite,private user: User,private httpClient: HttpClient,private app : App,private toastCtrl: ToastController) {
    this.loginData.logoUrl = 'img/logo.png';
    this.reAuthenticateUser();
  }

  reAuthenticateUser(){
    this.user.getCurrentUser().then(user=>{
      user = JSON.parse(user);
      if(user.isLogin){
        this.navCtrl.setRoot(HomePage);
      }else if(user.serverUrl){
        this.loginData.serverUrl = user.serverUrl;
      }else if(this.loginData.username){
        this.loginData.username = user.username;
      }
    });
  }

  login(){
    if(this.loginData.serverUrl){
      this.app.getFormattedBaseUrl(this.loginData.serverUrl)
        .then(formattedBaseUrl => {
          this.loginData.serverUrl = formattedBaseUrl;
          if(!this.loginData.username){
            this.setToasterMessage('Please Enter username');
          }else if (!this.loginData.password){
            this.setToasterMessage('Please Enter password');
          }else{
            this.app.getDataBaseName(this.loginData.serverUrl).then(databaseName=>{
              //generate tables
              this.sqlLite.generateTables(databaseName).then(()=>{
                this.loginData.currentDatabase = databaseName;
                this.user.setCurrentUser(this.loginData).then(user=>{
                  let fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                  this.httpClient.get('/api/me.json?'+fields,user).subscribe(
                    data => {
                      data = data.json();
                      this.user.setUserData(data).then(userData=>{
                        this.downloadingPrograms(user,databaseName);
                      });
                    },
                    err => {
                      this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                      console.log(err);
                    }
                  );
                }).catch(err=>{
                  console.log(err);
                  this.setStickToasterMessage('Fail set current user');
                })
              },()=>{
                //error on create database
                this.setStickToasterMessage('Fail to open local storage');
              });


            });
          }
        });
    }else{
      this.setToasterMessage('Please Enter server url');
    }
  }

  downloadingPrograms(user,databaseName){
    alert('downloading programs');
    let resource = 'programs';
    let tableMetadata = this.sqlLite.getDataBaseStructure()[resource];
    let fields = tableMetadata.fields;
    this.httpClient.get('/api/'+resource+'.json?paging=false&fields='+fields+'&filter=programType:eq:WITHOUT_REGISTRATION',user).subscribe(
      data => {
        alert('starting saving programs');
        let programsData = data.json();
        this.app.saveMetadata(resource,programsData[resource],databaseName).then(()=>{
          this.setStickToasterMessage('Complete saving all programs ');
          this.loginData.isLogin = true;
          this.user.setCurrentUser(this.loginData).then(user=>{
            this.navCtrl.setRoot(HomePage);
          })
        },error=>{
          this.setStickToasterMessage('Fail to save programs :: ' + JSON.stringify(error));
        });

      },
      err => {
        this.setStickToasterMessage('Fail to login Fail to downloading programs');
        console.log(err);
      }
    );
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
