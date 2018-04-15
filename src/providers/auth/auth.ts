import { Injectable, ViewChild } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Events as EventControl, Nav, LoadingController, ToastController } from 'ionic-angular';
import { ProfilePage } from './../../pages/profile/profile';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;


  constructor(public eventCtrl: EventControl,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              private sanitizer: DomSanitizer) {
    console.log('~ initialized Auth Provider ~');
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
    this.eventCtrl.publish('user:register', Date.now());
    return true;

  }

  login(email: string, pass: string){
    Meteor.loginWithPassword(email, pass, (err) => {
      if(err) {
        let error_toast = this.toastCtrl.create({
          message: err.message,
          duration: 2000,
          position: 'top',
          showCloseButton: true
        })
        error_toast.present();
        console.log(err.message);
      } else {
        console.log('loggedin')
        let success_load = this.loadingCtrl.create({
          spinner: 'hide',
          content: <string>this.sanitizer.bypassSecurityTrustHtml(`
          <div class="custom-spinner-container">
            <img src="assets/success_spinner.gif"></img>
          </div>
          `),
          duration: 1500
        });
        success_load.present();
        this.eventCtrl.publish('user:login', Date.now());
      }
    });
    
  }

  logout(){    
    Meteor.logout((err) => {
      if(err) {
        let error_toast = this.toastCtrl.create({
          message: err.message,
          duration: 2000,
          position: 'top',
          showCloseButton: true
        })
        error_toast.present();
        console.log(err.message);
      } else {
        this.eventCtrl.publish('user:logout', Date.now());
      }
    });
  }

  updateCheckIn(chosenEvent) {
    Meteor.call('users.updateLoc', {
        userId: Meteor.userId(),
        eventId: chosenEvent
    }, (err, res) => {
        if (err) {
        console.log(err);
        } else {
        console.log('updated current user\'s location');
        }
    });
  }

}
