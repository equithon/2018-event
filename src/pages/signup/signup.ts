import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';
import { ScannerPage } from './../scanner/scanner';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  firstName: string;
  lastName: string;
  userEmail: string;
  userPass: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Signup Page ~');
  }

  signUp(){
    let registered = this.auth.register({first: this.firstName, last: this.lastName, 
                                         email: this.userEmail, password: this.userPass, 
                                         canScan: true});
    if(registered) {
      this.navCtrl.setRoot(ScannerPage);
    }
  }

}
