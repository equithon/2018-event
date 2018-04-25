import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Events } from 'api/collections/events';
import { Event } from 'api/models';



@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  viewType: string;
  viewUser: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.viewType = navParams.get('view');
    this.viewUser = navParams.get('user');
    console.log('viewtype is ' + this.viewType);
    console.log(this.viewUser);

  }

  ionViewDidLoad() {
    console.log('~ loaded Check In Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'inline';
  }

}
