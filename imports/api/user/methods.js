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
        let user = Meteor.user();

        /* Customize email */
        Accounts.emailTemplates.siteName = 'Equithon';
        Accounts.emailTemplates.from = 'Equithon Hello <hello@equithon.org>';

        Accounts.emailTemplates.verifyEmail = {
            subject() {
                return "Equithon - Confirm your email address";
            },
            text(user, url) {
                return `Congratulations ${user.username}!

You are one step closer to applying to Equithon 2018. To finish creating your Equithon account, please click the link below to verify your email address.

${url}

Thanks,
Equithon Team
`;
            },
        };

        if (user) Accounts.sendVerificationEmail(user.username);
        else throw new Meteor.error('sendVerificationEmail.user_not_found', 'Could not find user with that email address');
    },
});
