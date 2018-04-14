import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
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
    this.attendees = Meteor.users.find().fetch();
    console.log(this.attendees);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectoryPage');
  }

}
