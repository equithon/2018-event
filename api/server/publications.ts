import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType } from './models';
import { Accounts } from 'meteor/accounts-base';

Meteor.publish('users', () => { 
    console.log('ok');
    return Meteor.users.find({}, {fields: { _id: 1, createdAt: 1, firstName: 1, lastName: 1, role: 1, specificInfo: 1, beenTo: 1, badges: 1 }}); 
});
  
Meteor.publish(null, function() {
    return Meteor.users.find({ _id: this.userId}, {fields: {firstName: 1, lastName: 1, role: 1, specificInfo: 1, beenTo: 1, badges: 1 }});
});

Meteor.publish('events', () => {
    return Events.find({}, {fields: { _id: 1, name: 1, time_start: 1, time_end: 1 }});
});