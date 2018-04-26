import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Event, EventType, UserRole, CheckInCodes, Badges, TimeIntervals } from './models';
import { Accounts } from 'meteor/accounts-base';



Meteor.methods({

	'volunteer.signIn'({ eventId }) {
		if(Meteor.userId()) {
			Meteor.users.update(Meteor.userId(),
				{ $set: { 'specificInfo.atEvent': eventId } } 
			);

			Meteor.users.update(Meteor.userId(),
				{ $addToSet: { 'specificInfo.signedIn': eventId } } 
			);

			let scheduledShift = (Meteor.user() as any).role === UserRole.ORGANIZER || 
								 (((Meteor.user() as any).role === UserRole.VOLUNTEER) ? ((Meteor.user() as any).specificInfo.shifts.indexOf(eventId) > -1) : false); // TODO: THIS IS WHERE YOU IMPLEMENT THE ACTUAL CHECK WHEN SHIFTS ARE DONE

			return scheduledShift; 
		} else {
			throw new Meteor.Error('userNotSignedIn', 'The user is not signed in.');
		}
		
	},

	'scanner.checkIn'({ userId }) {

		let scannedUser: any = Meteor.users.findOne({ _id: userId });
		console.log(scannedUser);
		let curUser: any = Meteor.user();
		console.log(curUser);
		let canScan: boolean = Meteor.userId() && (curUser.role === UserRole.ORGANIZER || (curUser.role === UserRole.VOLUNTEER && curUser.badges.indexOf(Badges.registered) > -1));
		let curEvent: Event;

		let scanSuccess: string = null;

		// ----------------------------- Handling Invalid Inputs ----------------------------
		if (!scannedUser) return {code: CheckInCodes.userNotFound, user: null };
		if (!canScan) return {code: CheckInCodes.cannotCheckIn, user: scannedUser };
		if (curUser.specificInfo.atEvent) {
			curEvent = Events.findOne({ _id: curUser.specificInfo.atEvent });
		} else {
			return {code: CheckInCodes.eventNotSelected, user: scannedUser };
		}

		// -- GENERAL ERRORS --
		if (!curEvent) {
			return {code: CheckInCodes.eventNotFound, user: scannedUser }; 
		} else if (curEvent.time_start > Date.now() || curEvent.time_end < Date.now() - 600000) { //10 min buffer time after event ends
			return {code: CheckInCodes.eventExpired, user: scannedUser };
		} else if (curEvent.type !== EventType.REGISTRATION && scannedUser.badges.indexOf(Badges.registered) === -1) {
			return {code: CheckInCodes.userNotRegistered, user: scannedUser };
		} else if ((curEvent.type !== EventType.MEAL && scannedUser.beenTo.indexOf(curEvent._id) > -1) || (curEvent.type === EventType.REGISTRATION  && scannedUser.badges.indexOf(Badges.registered) > -1)) {
			console.log('already scanned')
			return {code: CheckInCodes.userAlreadyScanned, user: scannedUser };
		} else if (!isNaN(curEvent.spots_free) && curEvent.spots_free <= 0) {
			return {code: CheckInCodes.eventFull, user: scannedUser };
		}
		console.log(curEvent.type);


		
		


		// ----------------------------- Handling Different Event Types ----------------------------
		// -- REGISTRATION --
		if (curEvent.type === EventType.REGISTRATION) {
			console.log('registration')

			let canAttend = true; // TODO: THIS IS WHERE YOU CHECK IF USER IS A VALID ATTENDEE

			if (canAttend) { 
				
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
				return {code: CheckInCodes.userCannotRegister, user: scannedUser };
			}

		}

		


		// -- FOOD --
		if (curEvent.type === EventType.MEAL) {
			console.log('meal');
			scanSuccess = CheckInCodes.mealCheckedIn;
			if (scannedUser.mealExceptions.length > 0) {
				scanSuccess = CheckInCodes.mealRestriction;
			} else if (scannedUser.beenTo.indexOf(curEvent._id) > -1) {
				scanSuccess = CheckInCodes.mealRepeat;
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
					// TODO: THIS IS WHERE YOU WOULD IMPLEMENT THE CHECK IN THE OTHER COLLECTION IF A USER IS UP FOR JUDGING
					if (scannedUser.specificInfo.judgingLoc !== curEvent.location) return {code: CheckInCodes.judgingWrongLoc, user: scannedUser };
					if (scannedUser.specificInfo.judgingTime > Date.now() + TimeIntervals.minute * 20) return {code: CheckInCodes.judgingWrongTime, user: scannedUser };

					Meteor.users.update(userId,
						{ $push: { 'badges': Badges.judged } }
					);
					Meteor.users.update(userId,
						{ $push: { 'beenTo': curEvent._id } }
					);
					scanSuccess = CheckInCodes.judgingCheckedIn;
				} else {
					return {code: CheckInCodes.judgingUnreleased, user: scannedUser };
				}
			} else {
				return {code: CheckInCodes.judgingUnable, user: scannedUser };
			}
			
		}


		// -- OTHER EVENTS (ACTIVITIES, WORKSHOPS, SPECIAL EVENTS, ETC) --
		if ([EventType.WORKSHOP, EventType.SPECIAL, EventType.PANEL, EventType.ACTIVITY].indexOf(curEvent.type) > -1) {
			console.log('updating event');
			Meteor.users.update(userId,
				{ $addToSet: { 'beenTo': curEvent._id } }
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

			return {code: scanSuccess, user: scannedUser };

		}


		return {code: CheckInCodes.miscError, user: null };

	}


});

