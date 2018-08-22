import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from './../../providers/auth/auth';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  shifts = [];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Schedule Page ~');
  }

  ionViewDidEnter() {
    Meteor.call('user.getShifts', {}, 
		(err, res) => {

			if (err) {
				console.log('couldn\'t get shifts, error was:');
				console.log(err);
			} else {
        console.log(res);
        try {
          let sched = document.getElementById('shiftSchedule');
          for(var s = 0; s < res.length; s++){ 
            if(res[s]) {
              let shiftName = (res[s]).name;
              let shiftTime = new Date(res[s].time_start).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
              let shiftLoc = (res[s]).location;
              sched.innerHTML += `<ion-item> ${shiftName} at ${shiftTime} in ${shiftLoc} </ion-item> <br>`;
            }
          }
        } catch(err) {
          console.log(err);
          this.auth.alertUser(err);
        }
      }
      
		});
  }

}
