import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';


/*
 * Customize verification email.
 */
Accounts.emailTemplates.siteName = "Meteor Guide Todos Example";
Accounts.emailTemplates.from = "Meteor Todos Accounts <accounts@example.com>";
Accounts.emailTemplates.verifyEmail = {
    subject(user) {
        return "Equithon - Confirm your email address";
    },
    
    text(user, url) {
        return `
Congratulations ${user.username}! You are one step closer to Equithon 2018.
To finish creating your Equithon account, please click the link below to verify your email address.

${url}

If you didn't request this email, please ignore it.
Thanks,
The Equithon Team.
`
    },
};

