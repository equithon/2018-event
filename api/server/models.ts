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
    readonly _id: string,
    name: string,
    type: EventType,
    location: string,
    time_start: string,
    time_end: string,
    spots_tot: number,
    spots_free: number
}
  