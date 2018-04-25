import { Meteor } from 'meteor/meteor';

import { HTTP } from 'meteor/http';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { rateLimit } from '../RateLimiter.js';


/*
 * Publish users.
 */
Meteor.publish('userData', function () {
    var fields = {
        firstName: 1,
        lastName: 1,
        emails: 1,
        isTeam: 1
    };

    // Publish all users and their emails for team members and only your own user if not
    if (this.userId && Meteor.user().isTeam) return Meteor.users.find({}, { fields });
    else if (this.userId) return Meteor.users.find({ _id: this.userId }, { fields });
    else this.ready();
});


/*
 * Verify captcha given valid Google ReCaptcha token.
 * Let Google handle actually validating the captchaToken.
 */
Meteor.methods({
    'user.verifyCaptcha'(captchaToken) {
        let result = HTTP.call('POST', 'https://www.google.com/recaptcha/api/siteverify', {
            params: {
                secret: process.env.GRECAPTCHA_SECRET,
                response: captchaToken,
            }
        });

        if (result.data !== null && result.data['error-codes'] === undefined && result.data.success) {
            return result.data.success;
        } else {
            let err = '';
            result.data['error-codes'].forEach((val) => {
                err = err + ' ' + val;
            });
            throw new Meteor.Error('user.verifyCaptcha.failure',
                'Failed to verify captcha:' + err);
        }
    },
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
        if (!this.userId) throw new Meteor.Error('user.sendVerificationLink.unauthorized',
                'You need to be logged in to send verification emails');

        // Get user and relevant attributes.
        let user = Meteor.user();
        let verificationTokens = user.services.email.verificationTokens;
        let email = user.emails[0];

        if (email !== undefined) {
            if (email.verified) {                                                   // Don't send another email if user is verified
                throw new Meteor.Error('user.sendVerificationLink.already_verified',
                    'Your email address is already verified');
            } else if (verificationTokens.length > 3) {                             // Limit emails to 3 per user
                throw new Meteor.Error('user.sendVerificationLink.spam',
                    'You have reached your email limit. Please contact hello@equithon.org for support');
            } else {                                                                // Verify captcha
                if (Meteor.call('user.verifyCaptcha', captchaToken)) {
                    Accounts.sendVerificationEmail(this.userId);
                }
            }
        } else {
            throw new Meteor.Error('user.sendVerificationEmail.no_email',
                    'You don\'t have an email to send a verification link to');
        }
    }
});

if (Meteor.isServer) {
    rateLimit({
        methods: [
            sendVerificationLink
        ],
        limit: 1,
        timeRange: 3000,
    });
}
