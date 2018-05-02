import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Rsvps } from './collections/rsvps';
import { Event, EventType, UserRole, TimeIntervals } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {
  // TODO: remove this code when deploying to production
  /* 
    SEED DATA FOR TESTING
  
  let evnt1: string, evnt2: string, evnt3: string, evnt4: string, evnt5: string, evnt6: string, evnt7: string, evnt8: string;
  let organizer: string, volunteer: string, judge: string, hacker: string;
  
  console.log("hello this is where you do stuff on startup");
    evnt1 = Events.insert(
      { _id: '204h308v43ur8', name: 'Registration',
        type: EventType.REGISTRATION, location: 'STC Concourse',
        time_start: Date.now(), time_end: Date.now() + (TimeIntervals.day * 3), // ends in 3 days from running test
        spots_tot: 60, spots_free: 60 });
    console.log(evnt1);

    evnt2 = Events.insert(
      { _id: '10b92c8d9f93mg', name: 'Judging - Access to Education Projects',
        type: EventType.JUDGING, location: 'STC 0060',
        time_start: Date.now(), time_end: Date.now() + (TimeIntervals.day * 3)}); // ends in 3 days from running test
    console.log(evnt2);

    evnt3 = Events.insert(
      { _id: '29g832zxg2b8', name: 'Judging - Mental Health Projects',
        type: EventType.JUDGING, location: 'STC 0010',
        time_start: Date.now(), time_end: Date.now() + (TimeIntervals.day * 3)}); // ends in 3 days from running test
    console.log(evnt3);
  
    evnt4 = Events.insert(
      { _id: '13h3xm130v9', name: 'Therapy Dogs',
        type: EventType.ACTIVITY, location: 'QNC 1501',
        time_start: Date.now() - 2000, time_end: Date.now() - 20, // ENDED ALREADY
        spots_tot: 40, spots_free: 12 });
    console.log(evnt4);

    evnt5 = Events.insert(
      { _id: '2b8we03mt9bw9', name: 'Programming Fundamentals',
        type: EventType.WORKSHOP, location: 'QNC 1502',
        time_start: Date.now(), time_end: Date.now() + (TimeIntervals.day * 3),
        spots_tot: 60, spots_free: 4 });
    console.log(evnt5);

    evnt6 = Events.insert(
      { _id: '19bw249g8wqu0', name: 'Data Science',
        type: EventType.WORKSHOP, location: 'QNC 2506',
        time_start: Date.now(), time_end: Date.now() + (TimeIntervals.day * 3),
        spots_tot: 60, spots_free: 0 });
    console.log(evnt6);

    evnt7 = Events.insert(
      { _id: '8b02xv829b9', name: 'Lunch with Aunty\'s Kitchen',
        type: EventType.MEAL, location: 'STC Basement',
        time_start: Date.now() - 1200000, time_end: Date.now() + (86400000 * 3)}); // started 20 mins ago
    console.log(evnt7);


    evnt8 = Events.insert(
      { _id: '90b93jbg2x9230', name: 'Dinner with Vincenzo\s',
        type: EventType.MEAL, location: 'STC Basement',
        time_start: Date.now() + TimeIntervals.hour, time_end: Date.now() + (86400000 * 3)});
    console.log(evnt8);
  

  
    organizer = Accounts.createUser(
      <any> // ORGANIZER
      { first: 'Alex', last: 'Xie', 
        role: UserRole.ORGANIZER,
        title: 'Operations Coordinator',
        email: 'organizer@gmail.com', password: 'organizer'}
    );
    console.log(organizer);

    volunteer = Accounts.createUser(
      <any> // VOLUNTEER
      { first: 'Paniel', last: 'Deng', 
        role: UserRole.VOLUNTEER, 
        shifts: [ evnt1, evnt3, evnt4 ],  
        email: 'volunteer@gmail.com', password: 'volunteer'}
    );
    console.log(volunteer);

    judge = Accounts.createUser(
      <any>
      { first: 'Emma', last: 'Watson', 
        role: UserRole.SPECIAL,
        title: 'Judge (Women Empowerment Category)',
        email: 'judge@gmail.com', password: 'judge'}
    );
    console.log(judge);

    hacker = Accounts.createUser(
      <any>
      { first: 'Mark', last: 'Zuckerberg', 
        role: UserRole.HACKER, 
        judgingLoc: 'STC 0040', judgingTime: Date.now() + TimeIntervals.hour, 
        email: 'hacker@gmail.com', password: 'hacker'}
    );
    console.log(hacker);

    Rsvps.insert(
      { userId: volunteer, attending: true,
        dietary: { vegetarian: false, vegan: false, gluten: false, halal: true, other: true }, 
        dietText: 'Lactose Intolerant', shirtSize: 's' }
    ); 

    Rsvps.insert(
      { userId: organizer, attending: true,
        diet: { vegetarian: false, vegan: false, gluten: false, halal: false, other: false }, 
        dietText: null, shirtSize: 'm' }
    ); 

    Rsvps.insert(
      { userId: judge, attending: false } 
    ); 

    Rsvps.insert(
      { userId: hacker, attending: true,
        diet: { vegetarian: false, vegan: true, gluten: true, halal: false, other: false }, 
        dietText: null, shirtSize: 'xl' }
    );  */

  

});


/* 
  Sets custom fields after creating a new user 
*/
Accounts.onCreateUser((options, user) => {
  console.log('new user created, setting custom fields');

  user.firstName = options.first;
  user.lastName = options.last;
  user.role = options.role;
  user.beenTo = []; // new users have gone to no events nor been registered yet

  // custom fields for different attendee roles
  if(options.role === UserRole.VOLUNTEER) {
    user.atEvent = null; // event that user is scanning codes at
    user.amtScanned = 0; 
    user.shifts = options.shifts || []; // default to no shifts if none are provided
    user.volunteered = []; // shifts that user has already signed in at (volunteered at)

  } else if(options.role === UserRole.ORGANIZER) {
    user.atEvent = null;
    user.amtScanned = 0;
    user.title = options.title || 'Organizer'; // defaults to Organizer if nothing more specific is provided in options.title
    user.shifts = options.shifts || [];
    
  } else if(options.role === UserRole.HACKER) {
    user.judged = false; // if the hacker has presented their project yet or not
    user.judgingLoc = options.judgingLoc || null; 
    user.judgingTime = options.judgingTime || null; 

  } else if(options.role === UserRole.SPECIAL) {
    user.title = options.title || 'VIP'; // more specific title for judge/mentor/sponsor/etc
    
  }

  
  
  return user;
})
