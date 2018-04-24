export enum UserRole {
    ORGANIZER = 0,
    VOLUNTEER,
    JUDGE,
    HACKER,
    MENTOR,
    SPONSOR
}

export enum EventType {
    MEAL = 0,
    ACTIVITY,
    WORKSHOP,
    PANEL,
    JUDGING,
    REGISTRATION,
    SPECIAL,
    OTHER
}

export enum CheckInCodes {

	cannotCheckIn = 'cannotCheckIn',
	eventNotSelected = 'eventNotSelected',
	eventExpired = 'eventExpired',
	eventNotFound = 'eventNotFound',
	eventFull = 'eventFull',

    userNotFound = 'userNotFound',
	userAlreadyScanned = 'userAlreadyScanned',
	userCannotRegister = 'userCannotRegister', 
	userNotRegistered = 'userNotRegistered',

	judgingWrongLoc = 'judgingWrongLoc', 
	judgingWrongTime = 'judgingWrongTime',
	judgingUnreleased = 'judgingUnreleased',
	judgingUnable = 'judgingUnable',

    miscError = 'miscError',
    
    mealTooSoon = 'mealTooSoon',
	mealRestriction = 'mealRestriction',
	mealCheckedIn = 'mealCheckedIn',
	registrationCheckedIn = 'registrationCheckedIn',
	judgingCheckedIn = 'judgingCheckedIn',
	eventCheckedIn = 'eventCheckedIn'
}



export enum Badges {

	role0 = 'I\'m an organizer!',
	role1 = 'I\'m a volunteer!',
	role2 = 'I\'m a judge!',
	role3 = 'I\'m a hacker!',
	role4 = 'I\'m a mentor!',
	role5 = 'I\'m a sponsor!',
	starScanner10 = 'I\'ve checked in more than 10 people!',
	starScanner50 = 'I\'ve checked in more than 50 people!',
	starScanner100 = 'I\'ve checked in more than 100 people!',
	registered = 'I registered for Equithon!',
	judged = 'I presented my project!',
	active = 'I participated in an activity!',
	learner = 'I learned something at a workshop!',
	winner = 'I won a prize!'
  
}

export enum TimeIntervals {

	day = 86400000,
	hour = 3600000,
	halfHour = 1800000,
	fifteenMinutes = 900000,
	minute = 60000

}

export interface Event {
    readonly _id: string,
    name: string,
    type: EventType,
    location: string,
    time_start: number,
    time_end: number,
    spots_tot?: number,
    spots_free?: number
}


  