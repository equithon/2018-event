import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';


/*
 * Send a verification email.
 */
export const sendVerificationEmail = new ValidatedMethod({
    name: 'sendVerificationEmail',

    validate: new SimpleSchema({
        email: { type: String, regEx: SimpleSchema.RegEx.Email },
    }).validator(),

    run(emailObj) {
        let user = Accounts.findUserByEmail(emailObj.email);

        if (user) Accounts.sendVerificationEmail(user._id, emailObj.email);
        else throw new Meteor.error('sendVerificationEmail.user_not_found', 'Could not find user with that email address');
    },
});
