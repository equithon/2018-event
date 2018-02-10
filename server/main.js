import { Meteor } from 'meteor/meteor';

import '/server/api.js';

import { EmailSubscriptions } from '/imports/api/email-subscriptions/email-subscriptions.js';
import Applications from '/imports/api/applications/applications.js';


Meteor.startup(() => {
    // Deny all client-side updates on our collections.
    EmailSubscriptions.deny({
      insert() { return true; },
      update() { return true; },
      remove() { return true; },
    });

    Applications.deny({
      insert() { return true; },
      update() { return true; },
      remove() { return true; },
    });

    Meteor.users.deny({
        insert() { return true; },
        update() { return true; },
        remove() { return true; },
    });
});
