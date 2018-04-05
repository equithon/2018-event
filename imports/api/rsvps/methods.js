import { Meteor } from 'meteor/meteor';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import Applications from '/imports/api/applications/applications.js';
import Rsvps from '/imports/api/rsvps/rsvps.js';
import { rateLimit } from '../RateLimiter.js';

/*
 * Publish RSVP responses to the user that owns the RSVP form
 */
Meteor.publish('rsvpData', function() {
    if (this.userId) {
        return Rsvps.find({ userId: this.userId }, {
            fields: {
                attending: 1,
                submitted: 1,
            }
        });
    } else this.ready();
});

/*
 * Submit a boolean answer from the RSVP form.
 */
export const submitRSVP = new ValidatedMethod({
    name: 'rsvps.submit',

    validate: new SimpleSchema({
        attending: { type: Boolean },
        submitted: { type: Boolean },
    }).validator(),

    run(rsvp) {
        if (!this.userId) {
            throw new Meteor.Error('rsvps.submit.unauthorized',
                'Please log in to submit your RSVP');
        }

        let app = Applications.findOne({ userId: this.userId });

        if (!app || !app.accepted) {
            throw new Meteor.Error('rsvps.submit.applicationNotAccepted',
                'Your applications must first be accepted by Equithon before you can RSVP');
        }

        Rsvps.upsert({ userId: this.userId }, {
            $set: {
                userId: this.userId,
                attending: rsvp.attending,
                submitted: rsvp.submitted,
            }
        }, (err, res) => {
            if (err) throw err;
        });
    }
});


// Rate limiting
if (Meteor.isServer) {
    rateLimit({
        methods: [
            submitRSVP
        ],
        limit: 1,
        timeRange: 3000,
    });
}
