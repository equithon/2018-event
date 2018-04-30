import { Injectable, ViewChild } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Events as EventControl, Nav, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UserRole } from 'api/models';

@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;


  roleStrings = [
    'Organizer',
    'Volunteer',
    'Hacker',
    'VIP',
    'OTHER'
  ]
  
  constructor(public eventCtrl: EventControl,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private sanitizer: DomSanitizer) {
    console.log('~ initialized Auth Provider ~');
    Meteor.subscribe('events');
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

    // TODO: display loading indicator until logged in
    
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
          content: <string>this.sanitizer.bypassSecurityTrustHtml(
            `
          <div class="custom-spinner-container">
            <img src="assets/imgs/success_spinner.gif"></img>
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
    let alert = this.alertCtrl.create({
      title: 'Log out',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yeah',
          handler: () => {
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
        }
      ]
    });
    alert.present();
    
  }

  volunteerSignIn(chosenEvent) {
    console.log(chosenEvent);
    Meteor.call('volunteer.signIn', {
      eventId: chosenEvent
    }, (err, res) => {
        console.log(err);
        console.log(res);

        if (err) {
          let alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 
            `
              Something went wrong.
            `,
            buttons: ['Oh no!']
          });
          alert.present();
          console.log('updated current user\'s location with warning');

        } else if(!res) {
          let alert = this.alertCtrl.create({
            title: 'Hmm...',
            subTitle: 
            `
              You don't seem to be scheduled to volunteer at this event and/or this time.
              Make sure you've selected the right event. If you've been rescheduled, ignore this warning.
            `,
            buttons: ['Got it.']
          });
          alert.present();
          console.log('updated current user\'s location with warning');

        } else {
          let success_toast = this.toastCtrl.create({
            message: 'Successfully signed in for shift.',
            duration: 2000,
            position: 'top',
            showCloseButton: true
          })
          success_toast.present();
          console.log('updated current user\'s location');

        }

    });
  }

  roleToString(role: number) {
    let roleStr: string = null;

    try {
      roleStr = (Meteor.user() as any).title;
    } catch {
      console.log('can\'t get title of user. either they are not logged in or they have no title');
    }

    return roleStr ? roleStr : this.roleStrings[role];

  }

  alertUser(msg: string) {
    let alert_toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
      showCloseButton: true
    });
    alert_toast.present();
  }

}
