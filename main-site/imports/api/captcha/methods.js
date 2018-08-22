import { Meteor } from 'meteor/meteor';

/*
 * Method to retrieve the public captcha site key for use by the client.
 */
Meteor.methods({
    'captcha.getSiteKey'() {
        return process.env.GRECAPTCHA_SITE_KEY;
    }
});
