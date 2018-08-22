import { Meteor } from 'meteor/meteor';

import { check, Match } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import checkAppCloseDate from '/imports/api/AppCloseDate.js';


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
    /* Don't accept any new users after application deadline */
    checkAppCloseDate();

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


/***** Email Customization *****/
/*
 * Customize password recovery email.
 */
Accounts.emailTemplates.siteName = "Equithon";
Accounts.emailTemplates.from = "Equithon <hello@equithon.org>";
Accounts.emailTemplates.resetPassword = {
    subject(user) {
        return "Equithon - Reset your password";
    },
    
    text(user, url) {
        url = url.replace('#/', 'accounts/'); // This is important as it allows us to route the link ourselves.
        url = url.replace('equithon-website-production.us-east-2.elasticbeanstalk.com/', 'equithon.org/');

        return `
You are receiving this email because you requested a password reset.
Please click the link below to reset your password.

${url}

If you didn't request this email, please ignore it.
Thanks,
The Equithon Team.
`
    },
};

/*
 * Customize verification email.
 */
Accounts.emailTemplates.siteName = "Equithon";
Accounts.emailTemplates.from = "Equithon <hello@equithon.org>";
Accounts.emailTemplates.verifyEmail = {
    subject(user) {
        return "Equithon - Confirm your email address";
    },
    
    text(user, url) {
        url = url.replace('#/', 'accounts/'); // This is important as it allows us to route the link ourselves.
        url = url.replace('equithon-website-production.us-east-2.elasticbeanstalk.com/', 'equithon.org/');

        return `
Congratulations ${user.firstName} ${user.lastName}! You are one step closer to Equithon 2018.
To finish creating your Equithon account, please click the link below to verify your email address.

${url}

If you didn't request this email, please ignore it.
Thanks,
The Equithon Team.
`
    },
};

