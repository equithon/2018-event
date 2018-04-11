import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfilePage } from './../profile/profile';
import { AuthProvider } from './../../providers/auth/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email: string;
  pass: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  logIn(){
    let x = this.auth.login(this.email, this.pass);
    Accounts.onLogin(
      () => {this.navCtrl.setRoot(ProfilePage, {}, {animate: true}); }
    )
    Accounts.onLoginFailure(
      () => {console.log('couldnt log in');}
    )
  }

}
