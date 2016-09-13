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
var home_1 = require('../home/home');
var app_1 = require('../../providers/app/app');
var user_1 = require('../../providers/user/user');
var http_client_1 = require('../../providers/http-client/http-client');
/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
var LoginPage = (function () {
    function LoginPage(navCtrl, user, httpClient, app, toastCtrl) {
        this.navCtrl = navCtrl;
        this.user = user;
        this.httpClient = httpClient;
        this.app = app;
        this.toastCtrl = toastCtrl;
        this.loginData = {};
        this.loginData.logoUrl = 'img/logo.png';
        this.reAuthenticateUser();
    }
    LoginPage.prototype.reAuthenticateUser = function () {
        var _this = this;
        this.user.getCurrentUser().then(function (user) {
            user = JSON.parse(user);
            if (user.isLogin) {
                _this.navCtrl.setRoot(home_1.HomePage);
            }
            else if (user.serverUrl) {
                _this.loginData.serverUrl = user.serverUrl;
            }
            else if (_this.loginData.username) {
                _this.loginData.username = user.username;
            }
        });
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        if (this.loginData.serverUrl) {
            this.app.getFormattedBaseUrl(this.loginData.serverUrl)
                .then(function (formattedBaseUrl) {
                _this.loginData.serverUrl = formattedBaseUrl;
                if (!_this.loginData.username) {
                    _this.setToasterMessage('Please Enter username');
                }
                else if (!_this.loginData.password) {
                    _this.setToasterMessage('Please Enter password');
                }
                else {
                    _this.app.getDataBaseName(_this.loginData.serverUrl).then(function (databaseName) {
                        _this.user.setCurrentUser(_this.loginData).then(function (user) {
                            var fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name],programs[id,name]]";
                            _this.httpClient.get('/api/me.json?' + fields, user).subscribe(function (data) {
                                _this.setStickToasterMessage('success to login ');
                                _this.user.setUserData(data).then(function (userData) {
                                    _this.loginData.isLogin = true;
                                    _this.user.setCurrentUser(_this.loginData).then(function (user) {
                                        _this.navCtrl.setRoot(home_1.HomePage);
                                    });
                                });
                            }, function (err) {
                                _this.setStickToasterMessage('Fail to login Fail to load System information, please checking your network connection');
                                console.log(err);
                            });
                        }).catch(function (err) {
                            console.log(err);
                            _this.setStickToasterMessage('Fail set current user');
                        });
                    });
                }
            });
        }
        else {
            this.setToasterMessage('Please Enter server url');
        }
    };
    LoginPage.prototype.setToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000
        });
        toast.present();
    };
    LoginPage.prototype.setStickToasterMessage = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true
        });
        toast.present();
    };
    LoginPage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/login/login.html',
            providers: [app_1.App, http_client_1.HttpClient, user_1.User]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController, user_1.User, http_client_1.HttpClient, app_1.App, ionic_angular_1.ToastController])
    ], LoginPage);
    return LoginPage;
})();
exports.LoginPage = LoginPage;
