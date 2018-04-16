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
          time_start: 1523730443341, time_end: 1524015072000}); // ends tuesday 9:30pm
    console.log(evnt4);

    let evnt5 = Events.insert(
      { _id: '29g832zxg2b8', name: 'Judging - Mental Health Category',
        type: EventType.JUDGING, location: 'QNC 1501',
        time_start: 1523730443341, time_end: 1524015072000}); // ends tuesday 9:30pm
    console.log(evnt5);
  }
  

});


let roleSpecificInfo = [ // important information to keep track of for each user

  { atEvent: null, amtScanned: 0 },
  { atEvent: null, amtScanned: 0 },
  { judgingCategory: null, judgedUsers: [] },
  { judgingLoc: null, judgingTime: null, devpostURL: null },
  { mentorCategory: null },
  { companyAffiliation: null, interestedUsers: [] }

]

let badges = {

  organizer: 'I\'m an organizer!',
  hacker: 'I\'m a hacker!',
  volunteer: 'I\'m a volunteer!',
  mentor: 'I\'m a mentor!',
  sponsor: 'I\'m a sponsor!',
  registered: 'I registered!',
  judged: 'I presented my project!',
  starScanner: 'I scanned over 50 codes!',
  workshop1: 'I participated in a workshop!',
  workshop5: 'I participated in 5 workshops!!',
  eaten10: 'I\'ve eaten 10 meals! Wow!'

}

Accounts.onCreateUser((options, user) => {
  console.log('new user created, setting custom fields');
  options.role = UserRole.VOLUNTEER;
  user.firstName = options.first;
  user.lastName = options.last;
  user.role = options.role;
  user.specificInfo = Object.assign({ shirtSize: 's', mealExceptions: [] }, roleSpecificInfo[user.role]);
  user.beenTo = []; // new users have gone to no events
  user.badges = [badges[user.role]]; // new users have no badges
  
  return user;
})
