import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType } from './models';
import { Accounts } from 'meteor/accounts-base';

Meteor.publish('users', () => { 
    return Meteor.users.find({}, {fields: { _id: 1, createdAt: 1, firstName: 1, lastName: 1, role: 1, shirtSize: 1, mealExceptions: 1, mealOther: 1, beenTo: 1, checkedIn: 1, shifts: 1, volunteered: 1, atEvent: 1, amtScanned: 1, title: 1, judged: 1 }}); 
});
  
Meteor.publish(null, function() {
    return Meteor.users.find({ _id: this.userId}, {fields: {firstName: 1, lastName: 1, role: 1, shirtSize: 1, mealExceptions: 1, mealOther: 1, beenTo: 1, checkedIn: 1, shifts: 1, volunteered: 1, atEvent: 1, amtScanned: 1, title: 1, judged: 1 }});
});

Meteor.publish('events', () => {
    return Events.find({}, {fields: { _id: 1, name: 1, time_start: 1, time_end: 1 }});
});