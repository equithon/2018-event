import { MongoObservable } from 'meteor-rxjs';
import { Event, EventType } from '../models';
 
export const Events = new MongoObservable.Collection<Event>('events');