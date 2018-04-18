import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';
import { Event, EventType } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';
import { AuthProvider } from './../../providers/auth/auth';
import { DataProvider } from './../../providers/data/data';

// this page should only be shown when there is a logged in user
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loggedin: any;
  events: Event[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public auth: AuthProvider, public data: DataProvider) {
    this.loggedin = Meteor.user() || null;
    this.events = Events.find().fetch();
  }

  ionViewDidLoad() {
    console.log('~ loaded Profile Page ~');
  }


}
