import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from './../../../api/server/collections/events';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: any;
  viewType: string;
  been: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.user = navParams.get('details');
    this.viewType = navParams.get('view');
    this.been = this.user.beenTo.indexOf((Meteor.user() as any).scanInfo.atEvent) > -1;
    console.log(this.been);
    console.log('read in user %s', this.user._id);
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('loaded user page');
  }

  checkUserIn() {
    Meteor.call('users.checkIn', {
      userId: this.user._id,
      eventId: (Meteor.user() as any).scanInfo.atEvent
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updated');
      }
    });
  }

}
