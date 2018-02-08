import { Meteor } from 'meteor/meteor';

import { HTTP } from 'meteor/http';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';


/*
 * Publish additional user fields.
 */
Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, {
      fields: { firstName: 1, lastName: 1 }
    });
  } else {
    this.ready();
  }
});


/*
 * Verify captcha given valid captcha token.
 */
Meteor.methods({
    'user.verifyCaptcha'(captchaToken) {
        console.log('CAPTCHA: ' + captchaToken);

        let result = HTTP.call('POST', 'https://www.google.com/recaptcha/api/siteverify', {
            params: {
                secret: "6Le7Q0UUAAAAANuMhnA7rX-NbXm1UhdaD_pw0g9-",
                response: captchaToken,
            }
        });

        console.log(result);

        if (result.data !== null && result.data['error-codes'] === undefined) {
            return result.data.success;
        } else {
            let err = '';
            result.data['error-codes'].forEach((val) => {
                err = err + ' ' + val;
            });
            throw Meteor.Error('user.verifyCaptcha.failure',
                'Failed to verify captcha:' + err);
        }
    }
});

/*
 * Accounts.onCreateUser automatically sends a verification link,
 * but we might potentially send another so let's make a method
 * for this.
 */
export const sendVerificationLink = new ValidatedMethod({
    name: 'user.sendVerificationLink',

    validate: new SimpleSchema({
        captchaToken: { type: String },
    }).validator(),

    run({ captchaToken }) {
        if (!this.userId) throw Meteor.Error('user.sendVerificationLink.unauthorized',
                'You need to be logged in to send verification emails');
        
        // Get user and relevant attributes.
        let user = Meteor.user();
        let verificationTokens = user.services.email.verificationTokens;
        let email = user.emails[0];

        if (email !== undefined) {
            let verified = email.verified;

            if (verified) {
                throw Meteor.Error('user.sendVerificationLink.already_verified',
                    'Your email address is already verified');
            } else if (verificationTokens.length > 5) {  // Limit emails to 5 per user
                throw Meteor.Error('user.sendVerificationLink.spam',
                    'You have reached email limit. Please contact hello@equithon.org for support');
            } else {   // Verify captcha
                Meteor.call('user.verifyCaptcha', captchaToken, (err, res) => {
                    if (err) throw err;
                    else if (res !== undefined && res) {
                        console.log("SUCCESS");
                        Accounts.sendVerificationEmail(this.userId);
                    }
                });
            }
        } else {
            throw Meteor.Error('user.sendVerificationEmail.no_email',
                    'You don\'t have an email to send a verification link to');
        }
    }
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
