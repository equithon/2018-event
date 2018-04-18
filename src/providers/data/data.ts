import { Injectable } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Events } from './../../../api/server/collections/events';
import { Event, EventType, UserRole } from './../../../api/server/models';

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

 
  badges = {

    role0: 'I\'m an organizer!',
    role1: 'I\'m a volunteer!',
    role2: 'I\'m a judge!',
    role3: 'I\'m a hacker!',
    role4: 'I\'m a mentor!',
    role5: 'I\'m a sponsor!',
    registered: 'I registered for Equithon!',
    judged: 'I presented my project!',
    starScanner: 'I scanned over 50 codes!',
    workshop1: 'I participated in a workshop!',
    workshop5: 'I participated in 5 workshops!!',
    eaten10: 'I\'ve eaten 10 meals! Wow!'

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


  constructor() {
    console.log('~ initialized Data Provider ~');
    Meteor.subscribe('users');
    Meteor.subscribe('events');
  }

  checkUserIn(scannedId): string {

    let curUser: any = Meteor.user();
    let selectedUser: any = Meteor.users.findOne({ _id: scannedId });
    console.log('logged in user is ');
    console.log(curUser);

    console.log('checkin user is ');
    console.log(selectedUser);

    // no user found, show error
    if(!selectedUser){
      console.log('no user found');
      return this.checkinOptions.userNotFound;
    } // user is not a volunteer or organizer, show the default view
    else if(!curUser || (curUser.role !== UserRole.ORGANIZER && curUser.role !== UserRole.VOLUNTEER)) {
      console.log('user is not a volunteer or organizer or not logged in, showing default view');
      return this.checkinOptions.cannotCheckin;
    }


    let curEventId = curUser.specificInfo.atEvent;
    let selectedEvent: Event = Events.findOne({ _id: curEventId });
    console.log('checkin event is ');
    console.log(selectedEvent);

    // no event is selected for volunteer/organizer, tell them to select one to check people in
    if(!curEventId){
      console.log('no event is selected');
      return this.checkinOptions.eventNotSet;

    } // event that they selected was not found (this should never happen)
    else if(!selectedEvent) {
      console.log('no event found');
      return this.checkinOptions.eventNotFound;

    } // event they have currently selected has ended (most likely they forgot to switch their event)
    else if(selectedEvent.time_end < Date.now()) {
      console.log('event is over');
      return this.checkinOptions.eventNotValid;

    } // event is registration
    else if(selectedEvent.type === EventType.REGISTRATION) {
      if(selectedUser.badges.indexOf(this.badges.registered) > -1) {
        console.log('user has already registered!');
        return this.checkinOptions.registerWarning;

      } else if(this.userCheckinRegister(scannedId)) {
        console.log('successfully registered %s', selectedUser.name);
        return this.checkinOptions.registerSuccess;
        
      }
      console.log('something is off about %s - cant check them in!', selectedUser.name);
      return this.checkinOptions.registerFail;

    } // user hasnt registered yet
    else if(selectedUser.badges.indexOf(this.badges.registered) === -1) {
      console.log('something is off about %s - they haven\'t registered yet! send them to the help desk', selectedUser.name);
      return this.checkinOptions.userNotRegistered;
    } // event is a meal
    else if(selectedEvent.type === EventType.MEAL) {
      if(selectedUser.beenTo.indexOf(curEventId) === -1) { // user's first meal
        this.userCheckinEvent(scannedId, selectedEvent._id, selectedEvent.type);
        // user has special dietary restrictions
        if(selectedUser.specificInfo.mealExceptions.length > 0){
          console.log('%s has special restrictions', selectedEvent.name);
          return this.checkinOptions.specialMeal;
          
        }
        console.log('%s first meal', selectedEvent.name);
        return this.checkinOptions.firstMeal;

      } 
      // user's second or more meal
      this.userCheckinEvent(scannedId, selectedEvent._id, selectedEvent.type);
      console.log('%s not first meal', selectedEvent.name);
      return this.checkinOptions.tooFastMeal;

    } // user already scanned at the event
    else if(selectedUser.beenTo.indexOf(curEventId) > -1) {
      console.log('user already been to %s', selectedEvent.name);
      return this.checkinOptions.userAlreadyScanned;

    } // event is judging
    else if(selectedEvent.type === EventType.JUDGING) {
      if(selectedUser.role === UserRole.HACKER && 
         (selectedUser.specificInfo.judgingLoc && selectedUser.specificInfo.judgingTime) && // checks if judging times have been assigned
         selectedUser.specificInfo.judgingLoc === selectedEvent.location &&
         selectedUser.specificInfo.judgingTime - 600000 <= Date.now()) { 
        console.log('%s is ready for judging', selectedUser.name);
        this.userCheckinJudging(scannedId, selectedEvent._id);
        return this.checkinOptions.judgeSuccess;
    
      }
      console.log('%s\'s judging time has not been released, or they are not up for judging at this location/time', selectedUser.name);
      return this.checkinOptions.judgeFail;

    } 
    
    // event is full
    else if(selectedEvent.spots_free <= 0) {
      console.log('%s is full', selectedEvent.name);
      return this.checkinOptions.eventFull;

    } // event is a workshop, or activity
    else if([EventType.WORKSHOP_TECH_BGNR, 
               EventType.WORKSHOP_TECH_INTER,
               EventType.WORKSHOP_TECH_ADV, 
               EventType.WORKSHOP_NON_TECH,
               EventType.WORKSHOP_OTHER, 
               EventType.ACTIVITY].indexOf(selectedEvent.type) > -1){
      console.log('%s successfully checked in', selectedEvent.name);
      this.userCheckinEvent(scannedId, selectedEvent._id, selectedEvent.type);
      return this.checkinOptions.eventSuccess;

    }

    console.log('an unknown error has occurred');
    return this.checkinOptions.miscError;
  }


  // returns true if it is the scanned users time slot for judging and the location is correct
  isJudgingTime(hackerId, eventId): boolean {  
    return true;
  }


  // ERROR: always returns false, cannot return from callback 
  // updates the user in meteor, adds badge to user
  userCheckinRegister(curUserId){
    Meteor.call('users.checkInRegister', {
      userId: curUserId
    }, (err, res) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('updated');
        return true;
      }
    });
  }


  // updates user in meteor, decrements event spots_free, adds event to user beenTo & adds badge to user if required
  userCheckinEvent(curUserId, atEvent, eventType) {
    Meteor.call('users.checkInEvent', {
      userId: curUserId,
      eventId: atEvent,
      type: eventType,
    }, (err, res) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('updated');
        return true;
      }
    });
  }

  // updates user in meteor, adds user's team to judge queue of upcoming judging sessions
  userCheckinJudging(curUserId, atEvent){
    Meteor.call('users.checkInJudging', {
      userId: curUserId,
      eventId: atEvent
    }, (err, res) => {
      if (err) {
        console.log(err);
        return false;
      } else {
        console.log('updated');
        return true;
      }
    });
  }

  roleToString(role: number) {
    return this.roleStrings[role];
  }

}
