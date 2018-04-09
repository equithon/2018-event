import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Event, EventType } from './../../../api/server/models';
import { DetailProvider } from './../../providers/detail/detail';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  events: Event[] = [
    { id: 1, name: 'Programming Fundamentals',
      type: EventType.WORKSHOP_TECH_BGNR, location: 'QNC 1502',
      time_start: '1:30', time_end: '2:30',
      spots_tot: 60, spots_free: 60,
      tags: [ 'beginner-friendly', 'git', 'deals' ] },
    { id: 2, name: 'Therapy Dogs',
      type: EventType.ACTIVITY, location: 'QNC 1501',
      time_start: '10:30', time_end: '12:00',
      spots_tot: 40, spots_free: 39,
      tags: [ 'dogs', 'destress', 'cute' ] }
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public detail: DetailProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePage');
  }

}
