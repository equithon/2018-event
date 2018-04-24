import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

let template = 'result.html';

@Component({
  selector: 'page-result',
  templateUrl: template,
})
export class ResultPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

}
