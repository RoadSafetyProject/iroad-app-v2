import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { Splashscreen } from 'ionic-native';

import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { ReportAccidentPage } from './pages/report-accident/report-accident';
import { ReportOffencePage } from './pages/report-offence/report-offence';
import { DriverVerificationPage } from './pages/driver-verification/driver-verification';
import { VehicleVerificationPage } from './pages/vehicle-verification/vehicle-verification';


@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any =HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Report Accident', component: ReportAccidentPage},
      { title: 'Report Offence', component: ReportOffencePage },
      { title: 'Driver Verification', component: DriverVerificationPage},
      { title: 'Vehicle Verification', component: VehicleVerificationPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut(){
    console.log('Log out has been clicked');
  }

}

ionicBootstrap(MyApp);
