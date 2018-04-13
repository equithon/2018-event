import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';

// this page should only be shown when there is a logged in user
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loggedin: any;
  testselect: any = "0";
  events: any = [
    {name: "Therapy Dogs", location: "STC 0040", time: "1:30PM", duration: "1 hour"},
    {name: "Intro to iOS", location: "STC 0040", time: "11:30AM", duration: "1 hour"},
    {name: "Dinner with Aunty's Kitchen", location: "STC 0040", time: "5:30PM", duration: "1 hour"}
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    Meteor.subscribe('users');
    this.loggedin = Meteor.user() || null;
    console.log(this.loggedin);
  }

  ionViewDidLoad() {
    console.log('loaded profile page');
  }

}
