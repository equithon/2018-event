import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType } from './models';
import { Accounts } from 'meteor/accounts-base';


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

Meteor.methods({


	'users.updateScanLoc'({ userId, eventId }) {
		Meteor.users.update(userId,
			{
				$set: { 'specificInfo.atEvent': eventId }
			});
	},


	'users.checkInEvent'({ userId, eventId, eventType }) {
		Meteor.users.update(userId,
			{
				$push: { 'beenTo': eventId }
			});
		if(eventType !== EventType.MEAL){
			Events.update(eventId, 
				{
					$inc: { 'spots_free': -1 }
				});
		}
	},

	'users.checkInRegister'({ userId, eventId}) {
		// IN THE FUTURE, this would be where you update the valid attendee database to show this attendee checked in
		//		but there's no such database right now since we don't have all the confirmed attendees as of April 15
		Meteor.users.update(userId,
			{
				$push: { 'badges': badges.registered }
			});
	},

	'users.checkinJudging'({ userId, eventId }) {
		// IN THE FUTURE, this would be where you update the valid attendee database to show this attendee checked in
		//		but there's no such database right now since we don't have all the confirmed attendees as of April 15
		Meteor.users.update(userId,
			{
				$push: { 'badges': badges.registered }
			});
	},


});