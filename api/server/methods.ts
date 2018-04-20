import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType, UserRole, CheckInCodes, Badges } from './models';
import { Accounts } from 'meteor/accounts-base';



Meteor.methods({


	'user.updateScanLoc'({ userId, eventId }) {
		Meteor.users.update(userId,
			{ $set: { 'specificInfo.atEvent': eventId } }
		);
	},

	'users.checkIn'({ userId }) {

		let scannedUser: any = Meteor.users.findOne({ _id: userId });
		console.log(scannedUser);
		let curUser: any = Meteor.user();
		console.log(curUser);
		let canScan: boolean = Meteor.userId() && (curUser.role === UserRole.ORGANIZER || curUser.role === UserRole.VOLUNTEER);
		let curEvent: Event;

		let scanSuccess: string = null;

		// ----------------------------- Handling Invalid Inputs ----------------------------
		if (!scannedUser) return CheckInCodes.userNotFound;
		if (!canScan) return CheckInCodes.cannotCheckIn;
		if (curUser.specificInfo.atEvent) {
			curEvent = Events.findOne({ _id: curUser.specificInfo.atEvent });
			if (!curEvent) return CheckInCodes.eventNotFound;
			if (curEvent.time_start > Date.now() || curEvent.time_end < Date.now() - 600000) { //10 min buffer time after event ends
				return CheckInCodes.eventExpired;
			}
		} else {
			return CheckInCodes.eventNotSelected;
		}


		console.log(curEvent.type);


		// -- GENERAL ERRORS --
		if (curEvent.type != EventType.REGISTRATION && scannedUser.badges.indexOf(Badges.registered) === -1) {
			return CheckInCodes.userNotRegistered;
		} else if (curEvent.type !== EventType.MEAL && curEvent.type !== EventType.REGISTRATION && scannedUser.beenTo.indexOf(curEvent._id) > -1) {
			return CheckInCodes.userAlreadyScanned;
		} else if (!isNaN(curEvent.spots_free) && curEvent.spots_free <= 0) {
			return CheckInCodes.eventFull;
		}


		// ----------------------------- Handling Different Event Types ----------------------------
		// -- REGISTRATION --
		if (curEvent.type === EventType.REGISTRATION) {
			console.log('registration')
			if (true) { // THIS IS WHERE YOU CHECK IF USER IS A VALID ATTENDEE
				console.log('past true')
				if (scannedUser.badges.indexOf(Badges.registered) > -1) {
					console.log('already registered')
					return CheckInCodes.userAlreadyRegistered;
				}
				console.log('registering user');
				Meteor.users.update(userId,
					{ $push: { 'badges': Badges.registered } }
				);
				Meteor.users.update(userId,
					{ $push: { 'beenTo': curEvent._id } }
				);
				scanSuccess = CheckInCodes.registrationCheckedIn;
			} else {
				console.log('cannot register)');
				return CheckInCodes.userCannotRegister;
			}

		}

		


		// -- FOOD --
		if (curEvent.type === EventType.MEAL) {
			console.log('meal');
			scanSuccess = CheckInCodes.mealCheckedIn;
			if (scannedUser.specificInfo.mealExceptions.length > 0) {
				scanSuccess = CheckInCodes.mealRestriction;
			} else if (scannedUser.beenTo.indexOf(curEvent._id) > -1 && curEvent.time_start > Date.now() - 600000) {
				scanSuccess = CheckInCodes.mealTooSoon;
			}
			Meteor.users.update(userId,
				{ $push: { 'beenTo': curEvent._id } }
			);
		}


		// -- JUDGING --
		if (curEvent.type === EventType.JUDGING) {
			console.log('judging');
			if (scannedUser.role === UserRole.HACKER) {
				if (scannedUser.specificInfo.judgingLoc && scannedUser.specificInfo.judgingTime) {
					if (scannedUser.specificInfo.judgingLoc !== curEvent.location) return CheckInCodes.judgingWrongLoc;
					if (scannedUser.specificInfo.judgingTime > Date.now() + 600000) return CheckInCodes.judgingWrongTime;

					Meteor.users.update(userId,
						{ $push: { 'badges': Badges.judged } }
					);
					Meteor.users.update(userId,
						{ $push: { 'beenTo': curEvent._id } }
					);
					scanSuccess = CheckInCodes.judgingCheckedIn;
				} else {
					return CheckInCodes.judgingUnreleased;
				}
			} else {
				return CheckInCodes.judgingUnable;
			}
			
		}


		// -- OTHER EVENTS (ACTIVITIES, WORKSHOPS, SPECIAL EVENTS, ETC) --
		if ([EventType.WORKSHOP, EventType.SPECIAL, EventType.PANEL, EventType.ACTIVITY].indexOf(curEvent.type) > -1) {
			console.log('updating event');
			Meteor.users.update(userId,
				{ $push: { 'beenTo': curEvent._id } }
			);
			if (curEvent.spots_free) {
				Events.update(curEvent._id,
					{ $inc: { 'spots_free': -1 } }
				);
			}
			scanSuccess = CheckInCodes.eventCheckedIn;
		}


		if (scanSuccess) {
			console.log('success is ' + scanSuccess);
			let newBadge: string = null;
			if (curUser.specificInfo.amtScanned + 1 === 10) newBadge = Badges.starScanner10;
			if (curUser.specificInfo.amtScanned + 1 === 50) newBadge = Badges.starScanner50;
			if (curUser.specificInfo.amtScanned + 1 === 100) newBadge = Badges.starScanner100;
			if (newBadge) {
				Meteor.users.update(curUser._id,
					{ $push: { 'badges': newBadge } }
				);
			}
			Meteor.users.update(curUser._id,
				{ $inc: { 'specificInfo.amtScanned': 1 } }
			);

			return scanSuccess;

		}


		return CheckInCodes.miscError;

	}


});

