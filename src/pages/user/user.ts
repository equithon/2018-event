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
  viewType: number;
  curLoc: string;

  viewOptions = {
    loggedOut: 'notLoggedInView',
    noEventSet: 'noEventView',
    eventOver: 'eventOverView',
    activitySuccess: 'activitySuccessView',
    activityFull: 'activityFullView',
    workshopSuccess: 'workshopSuccessView',
    workshopFull: 'workshopFullView',
    mealSuccess: 'mealSuccessView',
    mealSeconds: 'mealSecondsView',
    mealFinished: 'mealDeniedView',
    judgeSuccess: 'judgeSuccessView',
    judgeFail: 'judgeDeniedView',
    miscError: 'unexpectedErrorView'
  }

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.user = navParams.get('details');
    this.curLoc = Meteor.user() ? (Meteor.user() as any).scanInfo.atEvent : null;
    this.viewType = navParams.get('view');
    Meteor.subscribe('events', () => {
      this.events = Events.find().fetch();
    })
    console.log(this.curLoc);
    console.log(this.events);
    console.log(this.viewType);
    console.log('read in user %s', this.user._id);
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('loaded user page');
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
      }
    });
  }

}
