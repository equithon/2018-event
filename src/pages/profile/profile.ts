import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Meteor } from 'meteor/meteor';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  loggedin: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loggedin = Meteor.user() || null;
    console.log(this.loggedin);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
