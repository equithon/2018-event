import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event, EventType } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';
import { DetailProvider } from './../../providers/detail/detail';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  events: Event[];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public detail: DetailProvider) {
    Meteor.subscribe('events', () => {
      this.events = Events.find().fetch();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

}
