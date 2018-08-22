import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
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
              public auth: AuthProvider,
              public view: ViewController,
              public eventCtrl: Events) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Login Page ~');
  }

  logIn(){
    this.auth.login(this.email, this.pass);
    this.eventCtrl.subscribe('user:login', () => {
      this.view.dismiss();
    });
    
  }

}
