export enum UserRole {
    ORGANIZER = 0,
    VOLUNTEER,
	HACKER,
	SPECIAL,
	OTHER
    
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
    
    mealRepeat = 'mealRepeat',
	mealRestriction = 'mealRestriction',
	mealCheckedIn = 'mealCheckedIn',
	registrationCheckedIn = 'registrationCheckedIn',
	judgingCheckedIn = 'judgingCheckedIn',
	eventCheckedIn = 'eventCheckedIn'
	
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


  