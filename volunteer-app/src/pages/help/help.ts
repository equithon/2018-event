import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Help Page ~');
  }

}
