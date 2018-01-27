import Meteor from 'meteor/meteor';
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
        username:            { type: String },
        emails:              { type: Array },
        'emails.$':          { type: Object },
        'emails.$.address':  { type: String },
        'emails.$.verified': { type: Boolean },
        createdAt:           { type: Date },
        services:            { type: Object, blackbox: true },
    }).validate(user);

    return true;
});
