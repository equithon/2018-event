import { MongoObservable } from 'meteor-rxjs';
import { Status } from '../models';
 
export const Statuses = new MongoObservable.Collection<Status>('statuses');