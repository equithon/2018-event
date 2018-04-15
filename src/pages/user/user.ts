import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from './../../../api/server/collections/events';
import { Event } from './../../../api/server/models';


@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: any;
  events: Event[];
  viewType: string;
  curLoc: string;

  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.user = Meteor.users.findOne({_id: navParams.get('details').user})
    this.curLoc = Meteor.user() ? (Meteor.user() as any).scanInfo.atEvent : null;
    this.viewType = navParams.get('view');
    this.events = Events.find().fetch();
  }

  ionViewDidLoad() {
    console.log('~ loaded User Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'inline';
  }

  checkUserIn(atEvent) {
    Meteor.call('users.checkIn', {
      userId: this.user._id,
      eventId: atEvent
    }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updated');
        this.user.beenTo.push(atEvent);
      }
    });
  }

}
