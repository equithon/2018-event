import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Event, EventType } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';


@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {

  events: Event[];
  
  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Schedule Page ~');
  }

}
