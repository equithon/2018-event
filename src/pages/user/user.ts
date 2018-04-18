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

  badges = {

    role0: 'I\'m an organizer!',
    role1: 'I\'m a volunteer!',
    role2: 'I\'m a judge!',
    role3: 'I\'m a hacker!',
    role4: 'I\'m a mentor!',
    role5: 'I\'m a sponsor!',
    registered: 'I registered for Equithon!',
    judged: 'I presented my project!',
    starScanner: 'I scanned over 50 codes!',
    workshop1: 'I participated in a workshop!',
    workshop5: 'I participated in 5 workshops!!',
    eaten10: 'I\'ve eaten 10 meals! Wow!'

  }

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

  corresEvent(eventId){
    return this.events.find(e => (e._id === eventId));
  }

}
