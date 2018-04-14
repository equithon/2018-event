import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // seed the server with data
  console.log("hello this is where you do stuff on startup");
  if(Events.find({}).count() === 0){
    let evnt1 = Events.insert(
      { _id: '2b8we03mt9bw9', name: 'Programming Fundamentals',
        type: EventType.WORKSHOP_TECH_BGNR, location: 'QNC 1502',
        time_start: '1:30', time_end: '2:30',
        spots_tot: 60, spots_free: 60 });
    console.log(evnt1);
  
    let evnt2 = Events.insert(
        { _id: '19bw249g8wqu0', name: 'Data Science',
          type: EventType.WORKSHOP_TECH_INTER, location: 'QNC 2506',
          time_start: '11:30', time_end: '12:30',
          spots_tot: 60, spots_free: 42 });
    console.log(evnt2);
  
    let evnt3 = Events.insert(
        { _id: '13h3xm130v9', name: 'Therapy Dogs',
          type: EventType.ACTIVITY, location: 'QNC 1501',
          time_start: '10:30', time_end: '12:00',
          spots_tot: 40, spots_free: 39 });
    console.log(evnt3);
  
    let evnt4 = Events.insert(
        { _id: '8b02xv829b9', name: 'Lunch with Aunty\'s Kitchen',
          type: EventType.ACTIVITY, location: 'QNC 1501',
          time_start: '11:30', time_end: '1:00',
          spots_tot: 400, spots_free: 392 });
    console.log(evnt4);
  }
  

});

Meteor.methods({
  'users.updateLoc'({ userId, eventId }) {
  Meteor.users.update(userId, 
    {$set: {'scanInfo.atEvent': eventId}
  });
  },
  'users.checkIn'({ userId, eventId }) { // RIGHT NOW THIS ALLOWS FOR DUPLICATE ENTRIES!!!!!!!!
    Meteor.users.update(userId, 
      {$push: {'beenTo': eventId}
    });
    }
});

Accounts.onCreateUser((options, user) => {
  console.log('new user created, setting custom fields');
  user.firstName = options.first;
  user.lastName = options.last;
  user.scanInfo = options.canScan ? {atEvent: null, amtScanned: 0} : null; // if new user can scan, create
  user.beenTo = []; // new users have gone to no events
  user.badges = []; // new users have no badges
  
  return user;
})
