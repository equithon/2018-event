import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
//import { Roles } from 'meteor/alanning:roles';
import { DetailProvider } from './../../providers/detail/detail';

@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html',
})
export class DirectoryPage {

  attendees: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public detail: DetailProvider) {
    Meteor.subscribe('users', () => {
      this.attendees = Meteor.users.find().fetch();
      console.log(this.attendees);
    });
    console.log(Meteor.user());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectoryPage');
  }

}
