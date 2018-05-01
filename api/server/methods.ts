import { Meteor } from 'meteor/meteor';
import { Events } from './collections/events';
import { Rsvps } from './collections/rsvps';
import { Event, EventType, UserRole, CheckInCodes, TimeIntervals } from './models';
import { Accounts } from 'meteor/accounts-base';


Meteor.methods({

	/* 
		Signs in the volunteer to the right event, so that they can start scanning codes
	*/
	'volunteer.signIn'({ eventId }) {
		if(Meteor.userId() && ((Meteor.user() as any).role === UserRole.VOLUNTEER ||
							   (Meteor.user() as any).role === UserRole.ORGANIZER)) {

			Meteor.users.update(Meteor.userId(),
				{ $set: { 'atEvent': eventId } } 
			);

			Meteor.users.update(Meteor.userId(),
				{ $addToSet: { 'volunteered': eventId } } 
			);

			let scheduledShift = (Meteor.user() as any).role === UserRole.ORGANIZER || 
								 (Meteor.user() as any).shifts.indexOf(eventId) > -1;
								 
			return scheduledShift; 

		} else {
			throw new Meteor.Error('cannotSignIn', 'The user is not allowed to sign in to this event.');
		}
		
	},


	/* 
		Finds all the shifts that a specific volunteer is scheduled for
	*/
	'volunteer.getShifts'() {
		if(Meteor.userId() && (Meteor.user() as any).role === UserRole.VOLUNTEER) {
			let shiftIds: string[] = (Meteor.user() as any).shifts;
			let events: Event[] = shiftIds.map((id) => {
				return Events.findOne({_id: id});
			});

			return events;
		} else {
			throw new Meteor.Error('cannotGetShifts', 'The shifts for the user were not able to be obtained.');
		}
		
	},


	/* 
		Finds all the events at Equithon that are happening within +/- an hour of right now
	*/
	'app.getEvents'() {
		return Events.find(  {time_end: {$gte: Date.now() + TimeIntervals.hour} }).fetch(); 
		
	},

	/* 
		Registers a user for Equithon if at registration
		Allows users to grab food if volunteer is serving food
		Checks a user in to an activity/workshop/other event
	*/
	'scanner.checkIn'({ userId }) {

		let scanSuccess: string = null;
		let returnDetails: any = { eventName: null, userName: null, shirtSize: null, mealRestrictions: null, mealOther: null, judgingTime: null, judgingLoc: null };


		// ------- Invalid Input Checking -------
		let scannedUser: any = Meteor.users.findOne({ _id: userId });
		let scannedRsvp: any = Rsvps.findOne({ userId: userId });
		if (!scannedRsvp) return {code: CheckInCodes.userNotFound, details: returnDetails }; // first few if statements handle invalid inputs

		let curUser: any = Meteor.user();
		let canScan: boolean = Meteor.userId() && (curUser.role === UserRole.ORGANIZER || (curUser.role === UserRole.VOLUNTEER && curUser.checkedIn));
		if (!canScan) return {code: CheckInCodes.cannotCheckIn, details: returnDetails }; // checks if a user is logged in and allowed to scan codes
		if (!(curUser.atEvent)) return {code: CheckInCodes.eventNotSelected, details: returnDetails };

		let curEvent: Event = Events.findOne({ _id: curUser.atEvent });
		if (!curEvent) return {code: CheckInCodes.eventNotFound, details: returnDetails }; 


		try {
			returnDetails.eventName = curEvent.name;
			returnDetails.userName = scannedUser.firstName;
			returnDetails.shirtSize = scannedRsvp.shirtSize.toUpperCase();
			returnDetails.mealRestrictions = scannedRsvp.diet;
			returnDetails.mealOther = scannedRsvp.dietOther;
			returnDetails.judgingTime = new Date(scannedUser.judgingTime).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
			;
			returnDetails.judgingLoc = scannedUser.judgingLoc;

		} catch(err) {
			console.log(err);
		}
		
		

		if (curEvent.time_start > Date.now() || curEvent.time_end < Date.now() - TimeIntervals.fifteenMinutes) { //15 min buffer time after event ends
			return {code: CheckInCodes.eventExpired, details: returnDetails };

		} else if (curEvent.type !== EventType.REGISTRATION && !scannedUser.checkedIn) {
			return {code: CheckInCodes.userNotRegistered, details: returnDetails };

		} else if ((curEvent.type !== EventType.MEAL && scannedUser.beenTo.indexOf(curEvent._id) > -1) || 
				   (curEvent.type === EventType.REGISTRATION && scannedUser.checkedIn)) {
			console.log('already scanned');
			return {code: CheckInCodes.userAlreadyScanned, details: returnDetails };

		} else if (!isNaN(curEvent.spots_free) && curEvent.spots_free <= 0) {
			return {code: CheckInCodes.eventFull, details: returnDetails };
		}

		console.log(curEvent.type);
		console.log(scannedUser);
		console.log(curUser);

		


		// ----------------------------- Handling Different Event Types ----------------------------
		// -- REGISTRATION --
		if (curEvent.type === EventType.REGISTRATION) {
			console.log('registration')

			if (scannedRsvp.attending) { 
				console.log('registering user');
				Meteor.users.update(userId,
					{ $set: { 'checkedIn': true } }
				);
				Meteor.users.update(userId,
					{ $push: { 'beenTo': curEvent._id } }
				);
				scanSuccess = CheckInCodes.registrationCheckedIn;
				
			} else {
				console.log('cannot register)');
				return { code: CheckInCodes.userCannotRegister, details: returnDetails };

			}

		}

		

		// -- FOOD --
		if (curEvent.type === EventType.MEAL) {
			console.log('meal');
			scanSuccess = CheckInCodes.mealCheckedIn;
			if (scannedUser.beenTo.indexOf(curEvent._id) > -1) {
				scanSuccess = CheckInCodes.mealRepeat;
			}
			for(let key in scannedRsvp.diet) {
				if (scannedRsvp.diet[key]) {
					scanSuccess = CheckInCodes.mealRestriction;
				}
			} 
			
			Meteor.users.update(userId,
				{ $push: { 'beenTo': curEvent._id } }
			);

		}


		// -- JUDGING --
		if (curEvent.type === EventType.JUDGING) {
			console.log('judging');
			if (scannedUser.role === UserRole.HACKER) {
				if (scannedUser.judgingLoc && scannedUser.judgingTime) {
					if (scannedUser.judgingLoc !== curEvent.location) return {code: CheckInCodes.judgingWrongLoc, details: returnDetails };
					if (scannedUser.judgingTime > Date.now() + TimeIntervals.minute * 20) return {code: CheckInCodes.judgingWrongTime, details: returnDetails };
					
					Meteor.users.update(userId,
						{ $set: { 'judged': true } }
					);
					Meteor.users.update(userId,
						{ $push: { 'beenTo': curEvent._id } }
					);
					scanSuccess = CheckInCodes.judgingCheckedIn;

				} else {
					return {code: CheckInCodes.judgingUnreleased, details: returnDetails };
				}
			} else {
				return {code: CheckInCodes.judgingUnable, details: returnDetails };
			}
			
		}


		// -- OTHER EVENTS (ACTIVITIES, WORKSHOPS, SPECIAL EVENTS, ETC) --
		if ([EventType.WORKSHOP, EventType.SPECIAL, EventType.PANEL, EventType.ACTIVITY].indexOf(curEvent.type) > -1) {
			console.log('updating event');
			Meteor.users.update(userId,
				{ $addToSet: { 'beenTo': curEvent._id } }
			);
			if (curEvent.spots_free) { // only update spots of an event that tracks spots free
				Events.update(curEvent._id,
					{ $inc: { 'spots_free': -1 } }
				);
			}
			scanSuccess = CheckInCodes.eventCheckedIn;
			
		}


		if (scanSuccess) {
			console.log('success is ' + scanSuccess);
			
			Meteor.users.update(curUser._id,
				{ $inc: { 'amtScanned': 1 } }
			);

			return {code: scanSuccess, details: returnDetails };

		}

		return {code: CheckInCodes.miscError, details: returnDetails };

	}


});

