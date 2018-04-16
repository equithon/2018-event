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
    WORKSHOP_TECH_BGNR,
    WORKSHOP_TECH_INTER,
    WORKSHOP_TECH_ADV,
    WORKSHOP_NON_TECH,
    WORKSHOP_OTHER,
    JUDGING,
    REGISTRATION,
    OTHER
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
  