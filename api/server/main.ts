import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType, UserRole } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // seed the server with data
  console.log("hello this is where you do stuff on startup");
  if(Events.find({}).count() === 0){
    let evnt1 = Events.insert(
      { _id: '2b8we03mt9bw9', name: 'Programming Fundamentals',
        type: EventType.WORKSHOP_TECH_BGNR, location: 'QNC 1502',
        time_start: 1523730443341, time_end: 1523748672000, // sat at 7:30 end
        spots_tot: 60, spots_free: 60 });
    console.log(evnt1);
  
    let evnt2 = Events.insert(
        { _id: '19bw249g8wqu0', name: 'Data Science',
          type: EventType.WORKSHOP_TECH_INTER, location: 'QNC 2506',
          time_start: 1523730443341, time_end: 1523766672000, // sun 12:30 am
          spots_tot: 60, spots_free: 0 });
    console.log(evnt2);
  
    let evnt3 = Events.insert(
        { _id: '13h3xm130v9', name: 'Therapy Dogs',
          type: EventType.ACTIVITY, location: 'QNC 1501',
          time_start: 1523680272000, time_end: 1523680290000,//ENDED SAT MORNING
          spots_tot: 40, spots_free: 39 });
    console.log(evnt3);
  
    let evnt4 = Events.insert(
        { _id: '8b02xv829b9', name: 'Lunch with Aunty\'s Kitchen',
          type: EventType.MEAL, location: 'QNC 1501',
          time_start: 1523730443341, time_end: 1524015072000,// ends tuesday 9:30pm
          spots_tot: 400, spots_free: 392 });
    console.log(evnt4);

    let evnt5 = Events.insert(
      { _id: '29g832zxg2b8', name: 'Judging - Mental Health Category',
        type: EventType.JUDGING, location: 'QNC 1501',
        time_start: 1523730443341, time_end: 1524015072000,// ends tuesday 9:30pm
        spots_tot: 23, spots_free: 21 });
    console.log(evnt5);
  }
  

});

Meteor.methods({
  'users.updateLoc'({ userId, eventId }) {
  Meteor.users.update(userId, 
    {$set: {'scanInfo.atEvent': eventId}
  });
  },
  'users.checkIn'({ userId, eventId }) {
    if(Meteor.users.find({ _id: userId, beenTo: eventId}).count() === 0) { // prevent duplicate entries
      Meteor.users.update(userId, 
        {$push: {'beenTo': eventId}
      });
    }
  }
});

Accounts.onCreateUser((options, user) => {
  console.log('new user created, setting custom fields');
  user.firstName = options.first;
  user.lastName = options.last;
  user.role = UserRole.VOLUNTEER;
  user.scanInfo = {atEvent: null, amtScanned: 0}; // if new user can scan, create
  user.beenTo = []; // new users have gone to no events
  user.badges = []; // new users have no badges
  
  return user;
})
