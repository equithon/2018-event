import { Meteor } from 'meteor/meteor';

import { check, Match } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


/*
 * Configure accounts in our app.
 */
Accounts.config({
    sendVerificationEmail: true,
});

/*
 * Validate the contents of a new user.
 * The services field will contain their various forms of authentication.
 */
Accounts.validateNewUser((user) => {
    new SimpleSchema({
        _id:                 { type: String },
        firstName:           { type: String },
        lastName:            { type: String },
        emails:              { type: Array },
        'emails.$':          { type: Object },
        'emails.$.address':  { type: String, regEx: SimpleSchema.RegEx.Email },
        'emails.$.verified': { type: Boolean },
        createdAt:           { type: Date },
        services:            { type: Object, blackbox: true },
    }).validate(user);

    return true;
});

/*
 * onCreateUser override.
 *
 * Accounts.createUser can only be called from the client so in order to properly hook in the captcha
 * verification and have it all be done server side, the client should pass in the captchaToken as part of
 * the user object. We first verify the token from here, throwing an error if necessary, then validate the options
 * and add them to the user object.
 *
 * We also add new fields to the default user.
 */
Accounts.onCreateUser((options, user) => {
    /* Verify Captcha (synchronously so as to let the error propagate to the client) */
    Meteor.call('user.verifyCaptcha', options.captchaToken);
    console.log("VERIFIED CAPTCHA SUPPOSEDLY");

    /* Remove the key as we don't want it in the user object */
    delete options.captchaToken;

    /* Verify user fields */
    check(options, {
        firstName: String,
        lastName: String,
        email: String,
        password: Match.OneOf(String, { digest: String, algorithm: String })
    });

    /* Add extra non-Meteor fields and let Meteor add the rest */
    user.firstName = options.firstName;
    user.lastName  = options.lastName;

    return user;
});
