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
var http_client_1 = require('../../providers/http-client/http-client');
var user_1 = require('../../providers/user/user');
/*
  Generated class for the HomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
var HomePage = (function () {
    function HomePage(navCtrl, httpClient, user) {
        this.navCtrl = navCtrl;
        this.httpClient = httpClient;
        this.user = user;
        this.localStorage = new ionic_angular_1.Storage(ionic_angular_1.LocalStorage);
        this.getCurrentUser();
    }
    HomePage.prototype.getCurrentUser = function () {
        var _this = this;
        this.user.getCurrentUser().then(function (user) {
            _this.currentUser = JSON.parse(user);
        });
        this.user.getUserData().then(function (userData) {
            _this.userData = JSON.parse(userData);
        });
    };
    HomePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/home/home.html',
            providers: [http_client_1.HttpClient, user_1.User]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, http_client_1.HttpClient, user_1.User])
    ], HomePage);
    return HomePage;
})();
exports.HomePage = HomePage;
