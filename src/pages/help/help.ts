import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ResultPage } from './../result/result';
import { TimeIntervals } from './../../../api/server/models';

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
      
    'mealRepeat',
    'mealRestriction',
    'mealCheckedIn',
    'registrationCheckedIn',
    'judgingCheckedIn',
    'eventCheckedIn'
  ];


  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('~ loaded Help Page ~');
    console.log(this.viewOptions)
  }

  openView(res: string) {
    let testDetails = { eventName: 'Programming Fundamentals', userName: 'Alex', shirtSize: 'S', 
                        mealRestrictions: { vegetarian: true, vegan: true, gluten: true, halal: true, other: true }, 
                        mealOther: 'Lactose Intolerant', 
                        judgingTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }), judgingLoc: 'STC 0060' };

    let detailModal = this.modalCtrl.create(ResultPage, { view: res, details: testDetails});
    detailModal.present();
  }

}
