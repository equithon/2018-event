import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Event, EventType } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';


// this page should only be shown when there is a logged in user
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loggedin: any;
  testselect: any = "0";
  events: Event[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loggedin = Meteor.user() || null;
    // change this subscribe to something less network/data intensive
    Meteor.subscribe('events', () => {
      this.events = Events.find().fetch();
    });
    console.log(this.loggedin);
  }

  ionViewDidLoad() {
    console.log('loaded profile page');
  }

  updateCheckin() {
    Meteor.call('users.updateLoc', {
      userId: this.loggedin._id,
      eventId: this.loggedin.scanInfo.atEvent
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updated');
      }
    });
  }

}
