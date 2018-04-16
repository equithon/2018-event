import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { DataProvider } from './../../providers/data/data';
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
              public view: ViewController,
              public data: DataProvider) {
    this.user = Meteor.users.findOne({_id: navParams.get('details').user})
    this.curLoc = Meteor.user() ? (Meteor.user() as any).specificInfo.atEvent : null;
    this.viewType = navParams.get('view');
    this.events = Events.find().fetch();
  }

  ionViewDidLoad() {
    console.log('~ loaded User Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'inline';
  }

  checkUserIn(atEvent, eventType) {
    if(this.data.userCheckinEvent(this.user._id, atEvent, eventType)){
      console.log('successfully updated');
      this.user.beenTo.push(atEvent);
    } else {
      console.log('something went wrong while updating');
    }
  }

}
