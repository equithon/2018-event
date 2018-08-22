import { Event, EventType } from '../models';
 
export let Events = new Mongo.Collection<Event>('events');