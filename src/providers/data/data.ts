import { Injectable } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { Events } from './../../../api/server/collections/events';
import { Event, EventType } from './../../../api/server/models';

@Injectable()
export class DataProvider {

  checkinOptions = {
    userNotFound: 'noUserView',
    cannotCheckin: 'defaultView',
    loggedOut: 'notLoggedInView',
    eventNotSet: 'noEventView',
    eventNotFound: 'notFoundView',
    eventNotValid: 'notValidView',
    eventFull: 'eventFullView',
    activitySuccess: 'activitySuccessView',
    activityFull: 'activityFullView',
    workshopSuccess: 'workshopSuccessView',
    workshopFull: 'workshopFullView',
    mealAvailable: 'mealSuccessView',
    mealFinished: 'mealDeniedView',
    judgeSuccess: 'judgeSuccessView',
    judgeFail: 'judgeDeniedView',
    
    miscError: 'unexpectedErrorView'
  }

  events: any;
  users: any;


  constructor() {
    console.log('Hello DataProvider Provider');
    Meteor.subscribe('users');
    Meteor.subscribe('events');
    /*Meteor.subscribe('events', () => {
      this.events = new Mongo.Collection('all_events');
      this.events = Events.find({});
      console.log(this.events);
    })

    Meteor.subscribe('users', () => {
      this.users = new Mongo.Collection('all_users');
      this.users = Meteor.users.find({});
      console.log(this.users);
    }) */
  }

  checkUserIn(scannedId): string {

    let selectedUser: any = Meteor.users.findOne({ _id: scannedId });


    if(!selectedUser){
      console.log('no user found');
      return this.checkinOptions.userNotFound;
    }
    if(!Meteor.user() || ((Meteor.user() as any).role !== 1 || (Meteor.user() as any).role !== 1)) {
      console.log('user is not a volunteer or organizer, showing default view');
      return this.checkinOptions.cannotCheckin;
    }

    let curEventId = ((Meteor.user()) as any).scanInfo.atEvent;
    let selectedEvent: Event = Events.findOne({ _id: curEventId });
    


    if(!curEventId){
      console.log('no event is selected');
      return this.checkinOptions.eventNotSet;
    }

    

    console.log('checkin event is ');
    console.log(selectedEvent);

    console.log('checkin user is ');
    console.log(selectedUser);

    
    if(!selectedEvent) {
      console.log('no event found');
      return this.checkinOptions.eventNotFound;

    } else if(selectedEvent.time_end < Date.now()) {
      console.log('event is over');
      return this.checkinOptions.eventNotValid;

    } else if(selectedEvent.spots_free <= 0) {
      console.log('%s is full', selectedEvent.name);
      return this.checkinOptions.eventFull;

    } else if(selectedEvent.type === EventType.WORKSHOP_TECH_BGNR || selectedEvent.type === EventType.WORKSHOP_TECH_INTER || 
              selectedEvent.type === EventType.WORKSHOP_TECH_ADV || selectedEvent.type === EventType.WORKSHOP_NON_TECH ||
              selectedEvent.type === EventType.WORKSHOP_OTHER){
      console.log('%s successfully checked in', selectedEvent.name);
      return this.checkinOptions.workshopSuccess;

    } else if(selectedEvent.type === EventType.ACTIVITY) {
        console.log('%s successfully checked in', selectedEvent.name);
        return this.checkinOptions.activitySuccess;

    } else if(selectedEvent.type === EventType.MEAL) {
      console.log('%s taken', selectedEvent.name);
      let retval: string = selectedUser.beenTo.indexOf(curEventId) === -1 ? this.checkinOptions.mealAvailable : this.checkinOptions.mealFinished;
      // update user on meteor side here
      return retval;

    } else if(selectedEvent.type === EventType.JUDGING ) { // CHANGE THIS TO JUDGING
      if(this.judgingOpen(scannedId, curEventId)) { 
        console.log('%s is ready for judging', selectedUser.name);
        // update user on meteor side here
        return this.checkinOptions.judgeSuccess;
    
      }
      console.log('%s is not up for judging at this location or it is not their turn yet', selectedUser.name);
      return this.checkinOptions.judgeFail;
    }

    console.log('an unknown error has occurred');
    return this.checkinOptions.miscError;
  }

  judgingOpen(hackerId, eventId): boolean {  // returns true if it is the scanned users time slot for judging and the location is correct
    return true;
  }

}
