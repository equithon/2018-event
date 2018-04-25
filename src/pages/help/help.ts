import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ResultPage } from './../result/result';

@Component({
  selector: 'page-help',
  templateUrl: 'help.html',
})
export class HelpPage {

  viewOptions: string[] = [
    'cannotCheckIn',
    'eventNotSelected',
    'eventExpired',
    'eventNotFound',
    'eventFull',
  
    'userNotFound',
    'userAlreadyScanned',
    'userCannotRegister', 
    'userNotRegistered',
  
    'judgingWrongLoc', 
    'judgingWrongTime',
    'judgingUnreleased',
    'judgingUnable',
      
    'mealTooSoon',
    'mealRestriction',
    'mealCheckedIn',
    'registrationCheckedIn',
    'judgingCheckedIn',
    'eventCheckedIn'
  ]

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Help Page ~');
    console.log(this.viewOptions)
  }

  openView(res: string) {
    let detailModal = this.modalCtrl.create(ResultPage, { view: res + 'View', user: Meteor.users.findOne({ _id: 'xin8Zs8gw7d8zgnJX' }) });
    detailModal.present();
  }

}
