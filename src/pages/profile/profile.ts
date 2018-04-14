import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Event, EventType } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';
import { AuthProvider } from './../../providers/auth/auth';

// this page should only be shown when there is a logged in user
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loggedin: any;
  events: Event[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public auth: AuthProvider) {
    this.loggedin = Meteor.user() || null;
    // change this subscribe to something less network/data intensive
    Meteor.subscribe('events', () => {
      this.events = Events.find().fetch();
    });
    console.log('called')
    console.log(this.loggedin);
  }

  ionViewDidLoad() {
    console.log('loaded profile page');
  }


}
