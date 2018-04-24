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
              public view: ViewController) {
    this.viewType = navParams.get('view');
  }

  ionViewDidLoad() {
    console.log('~ loaded User Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'inline';
  }
  
}
