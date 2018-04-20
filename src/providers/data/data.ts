import { Injectable } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Events } from './../../../api/server/collections/events';
import { Event, EventType, UserRole } from './../../../api/server/models';
import { ToastController } from 'ionic-angular';

@Injectable()
export class DataProvider {

  checkinOptions = {
    userNotFound: 'noUserView',
    cannotCheckin: 'defaultView',
    eventNotSet: 'noEventView',
    eventNotFound: 'notFoundView',
    eventNotValid: 'notValidView',
    userNotRegistered: 'notRegisteredView',
    miscError: 'unexpectedErrorView',

    registerSuccess: 'registerSuccessView',
    registerWarning: 'registerWarningView',
    registerFail: 'registerFailView',

    judgeSuccess: 'judgeSuccessView',
    judgeFail: 'judgeDeniedView',

    eventSuccess: 'eventSuccessView',
    userAlreadyScanned: 'eventDuplicateView',
    eventFull: 'eventFullView',

    firstMeal: 'mealSuccessView',
    specialMeal: 'mealExceptionView',
    tooFastMeal: 'mealWarningView'
    
  }

  roleStrings = [
    'Organizer',
    'Volunteer',
    'Judge',
    'Hacker',
    'Mentor',
    'Sponsor'
  ]


  events: Event[];
  users: any;
  corresView: string;


  constructor(public toastCtrl: ToastController) {
    console.log('~ initialized Data Provider ~');
    Meteor.subscribe('users');
    Meteor.subscribe('events');
  }



  roleToString(role: number) {
    return this.roleStrings[role];
  }

  alertUser(msg: string) {
    let alert_toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'top',
      showCloseButton: true
    })
    alert_toast.present();
  }

  
}
