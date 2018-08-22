import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Rsvps } from './collections/rsvps';
import { Applications } from './collections/applications';
import { Event, EventType, UserRole, TimeIntervals } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {

  Applications.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  Meteor.users.deny({
      insert() { return true; },
      update() { return true; },
      remove() { return true; },
  });

  Rsvps.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

  Events.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
  });

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
