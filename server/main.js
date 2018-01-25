import { Meteor } from 'meteor/meteor';

import '/server/api.js';

import { EmailSubscriptions } from '/imports/api/email-subscriptions/email-subscriptions.js';


Meteor.startup(() => {
    // Deny all client-side updates on the EmailSubscriptions collection
    EmailSubscriptions.deny({
      insert() { return true; },
      update() { return true; },
      remove() { return true; },
    });
});
