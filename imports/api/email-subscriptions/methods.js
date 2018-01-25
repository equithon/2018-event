import { Meteor } from 'meteor/meteor';
import { EmailSubscriptions } from './email-subscriptions.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

/*
 * Insert validated email provided it doesn't already exist.
 * Note: SimpleSchema only validates objects so we need to pass email around in an object.
 */
export const insertEmailSubscription = new ValidatedMethod({
    name: 'email_subscriptions.insert',

    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email },
    }).validator(),

    run(emailObj) {
        if (EmailSubscriptions.find({ email: emailObj.email }).count() != 0) {
            throw new Meteor.Error('email_subscriptions.insert.email_exists', 'Email address already exists');
        } else {
            emailObj.createdAt = new Date();
            EmailSubscriptions.insert(emailObj);
        }
    },
});
