var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ionic_angular_1 = require('ionic-angular');
var ionic_native_1 = require('ionic-native');
var login_1 = require('./pages/login/login');
var home_1 = require('./pages/home/home');
var report_accident_1 = require('./pages/report-accident/report-accident');
var report_offence_1 = require('./pages/report-offence/report-offence');
var driver_verification_1 = require('./pages/driver-verification/driver-verification');
var vehicle_verification_1 = require('./pages/vehicle-verification/vehicle-verification');
var user_1 = require("./providers/user/user");
var MyApp = (function () {
    function MyApp(platform, user) {
        this.platform = platform;
        this.user = user;
        this.rootPage = login_1.LoginPage;
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Home', component: home_1.HomePage },
            { title: 'Report Accident', component: report_accident_1.ReportAccidentPage },
            { title: 'Report Offence', component: report_offence_1.ReportOffencePage },
            { title: 'Driver Verification', component: driver_verification_1.DriverVerificationPage },
            { title: 'Vehicle Verification', component: vehicle_verification_1.VehicleVerificationPage }
        ];
    }
    MyApp.prototype.initializeApp = function () {
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            ionic_native_1.StatusBar.styleDefault();
            ionic_native_1.Splashscreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    MyApp.prototype.logOut = function () {
        var _this = this;
        this.user.getCurrentUser().then(function (user) {
            user = JSON.parse(user);
            user.isLogin = false;
            _this.user.setCurrentUser(user).then(function (user) {
                _this.nav.setRoot(login_1.LoginPage);
            });
        });
    };
    __decorate([
        core_1.ViewChild(ionic_angular_1.Nav), 
        __metadata('design:type', ionic_angular_1.Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        core_1.Component({
            templateUrl: 'build/app.html',
            providers: [user_1.User]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform, user_1.User])
    ], MyApp);
    return MyApp;
})();
ionic_angular_1.ionicBootstrap(MyApp);
