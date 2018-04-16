import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType, UserRole } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // seed the server with data
  console.log("hello this is where you do stuff on startup");
  if(Events.find({}).count() === 0){
    let evnt1 = Events.insert(
      { _id: '204h308v43ur8', name: 'Registration',
        type: EventType.REGISTRATION, location: 'STC Concourse',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3), // ends in 3 days from running test
        spots_tot: 60, spots_free: 60 });
    console.log(evnt1);

    let evnt2 = Events.insert(
      { _id: '10b92c8d9f93mg', name: 'Judging - Access to Education Projects',
        type: EventType.JUDGING, location: 'STC 0060',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3)}); // ends in 3 days from running test
    console.log(evnt2);

    let evnt3 = Events.insert(
      { _id: '29g832zxg2b8', name: 'Judging - Mental Health Projects',
        type: EventType.JUDGING, location: 'STC 0010',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3)}); // ends in 3 days from running test
    console.log(evnt3);
  
    let evnt4 = Events.insert(
      { _id: '13h3xm130v9', name: 'Therapy Dogs',
        type: EventType.ACTIVITY, location: 'QNC 1501',
        time_start: Date.now() - 2000, time_end: Date.now() - 20, // ENDED ALREADY
        spots_tot: 40, spots_free: 12 });
    console.log(evnt4);

    let evnt5 = Events.insert(
      { _id: '2b8we03mt9bw9', name: 'Programming Fundamentals',
        type: EventType.WORKSHOP_TECH_BGNR, location: 'QNC 1502',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3),
        spots_tot: 60, spots_free: 4 });
    console.log(evnt5);

    let evnt6 = Events.insert(
      { _id: '19bw249g8wqu0', name: 'Data Science',
        type: EventType.WORKSHOP_TECH_INTER, location: 'QNC 2506',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3),
        spots_tot: 60, spots_free: 0 });
    console.log(evnt6);

    let evnt7 = Events.insert(
      { _id: '8b02xv829b9', name: 'Lunch with Aunty\'s Kitchen',
        type: EventType.MEAL, location: 'STC Basement',
        time_start: Date.now() - 1200000, time_end: Date.now() + (86400000 * 3)}); // started 20 mins ago
    console.log(evnt7);


    let evnt8 = Events.insert(
      { _id: '90b93jbg2x9230', name: 'Dinner with Vincenzo\s',
        type: EventType.MEAL, location: 'STC Basement',
        time_start: Date.now(), time_end: Date.now() + (86400000 * 3)});
    console.log(evnt8);
  }

  if(Meteor.users.find({}).count() === 0){
    let organizer = Accounts.createUser(
      <any>
      { first: 'Organizer', last: 'Test', 
        role: UserRole.ORGANIZER, dietary: [], shirt: 'M',
        email: 'organizer@gmail.com', password: 'organizer'}
    );
    console.log(organizer);

    let volunteer = Accounts.createUser(
      <any>
      { first: 'Volunteer', last: 'Test', 
        role: UserRole.VOLUNTEER, dietary: ['Lactose Intolerant'],  shirt: 'M',
        email: 'volunteer@gmail.com', password: 'volunteer'}
    );
    console.log(volunteer);

    let judge = Accounts.createUser(
      <any>
      { first: 'Judge', last: 'Test', 
        role: UserRole.JUDGE, dietary: [], shirt: 'XS',
        email: 'judge@gmail.com', password: 'judge'}
    );
    console.log(judge);

    let hacker = Accounts.createUser(
      <any>
      { first: 'Hacker', last: 'Test', 
        role: UserRole.HACKER, dietary: ['Vegan', 'Halal'], shirt: 'M',
        email: 'hacker@gmail.com', password: 'hacker'}
    );
    console.log(hacker);

    let mentor = Accounts.createUser(
      <any>
      { first: 'Mentor', last: 'Test', 
        role: UserRole.MENTOR, dietary: ['Nut Allergy'], shirt: 'S',
        email: 'mentor@gmail.com', password: 'mentor'}
    );
    console.log(mentor);

    let sponsor = Accounts.createUser(
      <any>
      { first: 'Sponsor', last: 'Test', 
        role: UserRole.SPONSOR, dietary: [], shirt: 'XL',
        email: 'sponsor@gmail.com', password: 'sponsor'}
    );
    console.log(sponsor);
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

Accounts.onCreateUser((options, user) => {
  console.log('new user created, setting custom fields');
  user.firstName = options.first;
  user.lastName = options.last;
  user.role = options.role;
  user.specificInfo = Object.assign({ shirtSize: options.shirt, mealExceptions: options.dietary }, roleSpecificInfo[user.role]);
  user.beenTo = []; // new users have gone to no events
  user.badges = [badges[('role' + user.role)]]; // new users have no badges except their role badge
  
  return user;
})
