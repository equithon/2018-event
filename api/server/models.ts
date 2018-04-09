export enum AttendeeRole {
    ORGANIZER = 1,
    MENTOR,
    SPONSOR,
    VOLUNTEER,
    HACKER
}

export enum EventType {
    MEAL = 1,
    ACTIVITY,
    WORKSHOP_TECH_BGNR,
    WORKSHOP_TECH_INTER,
    WORKSHOP_TECH_ADV,
    WORKSHOP_NON_TECH,
    WORKSHOP_OTHER,
    OTHER
}

export interface Event {
    readonly id: number,
    name: string,
    type: EventType,
    location: string,
    time_start: string,
    time_end: string,
    spots_tot: number,
    spots_free: number, 
    tags?: string[]
}

export interface Status {
    readonly id: number,
    action: string,
    need_secondary: boolean,
    available_to: AttendeeRole[]
}

export interface Attendee {
    _id?: number,
    name: string,
    email: string,
    pass: string,
    profile_img?: string,
    role: AttendeeRole,
    status: {
        doing: string,
        secondary: string // ID of the event the user is currently attending/participating in
    }
    favs: string[], // IDs of the events the user has in their favourites
    been_to: string[],
    scan_info: {
        quick: boolean,
        amt: number,
    }
}
  