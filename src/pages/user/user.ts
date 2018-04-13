import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  user: any;
  viewType: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.user = navParams.get('details');
    this.viewType = navParams.get('view');
    console.log('read in user %s', this.user._id);
    console.log(this.user);
  }

  ionViewDidLoad() {
    console.log('loaded user page');
  }

}
