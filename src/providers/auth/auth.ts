import { Injectable, ViewChild } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Events, Nav, LoadingController, ToastController } from 'ionic-angular';
import { ProfilePage } from './../../pages/profile/profile';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;


  constructor(public events: Events,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private sanitizer: DomSanitizer) {
    console.log('Hello AuthProvider Provider');
  }

  register(new_user: any){
    let fail: Error = null;
    Accounts.createUser(new_user,
                        function(error){ fail = error; }); 
    console.log(fail);
    if(fail) {
      console.log('failed to register with error: %s', fail.message);
      return false;
    }
    console.log('sucessfully registered %s', new_user.email);
    this.events.publish('user:register', Date.now());
    return true;

  }

  login(email: string, pass: string){
    Meteor.loginWithPassword(email, pass, (error) => {
      if(error) {
        let error_toast = this.toastCtrl.create({
          message: error.message,
          duration: 2000,
          position: 'top',
          showCloseButton: true
        })
        error_toast.present();
        console.log(error.message);
      } else {
        let success_load = this.loadingCtrl.create({
          spinner: 'hide',
          content: <string>this.sanitizer.bypassSecurityTrustHtml(`
          <div class="custom-spinner-container">
            <img src="assets/success_spinner.gif"></img>
          </div>
          `),
          duration: 1500
        });

        success_load.onDidDismiss(() => {
          // this would be a better place to put the checkmark 
        });
        success_load.present();
        this.events.publish('user:login', Date.now());
      }
    });

    
  }

  logout(){
    console.log('logging out');
    this.events.publish('user:logout', Date.now());
    Meteor.logout();
  }

}
