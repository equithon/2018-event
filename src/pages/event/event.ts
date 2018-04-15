import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Event, EventType } from './../../../api/server/models';

@Component({
  selector: 'page-event',
  templateUrl: 'event.html',
})
export class EventPage {

  event: Event;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.event = navParams.get('details');
  }

  ionViewDidLoad() {
    console.log('~ loaded Directory Page ~');
  }

}
