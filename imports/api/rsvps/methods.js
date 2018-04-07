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
                attending:             1,
                confirmTravellingFrom: 1,
                needBus:               1,
                requireAccomodation:   1,
                roommateRequest:       1,
                roommateRequestName:   1,
                roommateRequestEmail:  1,
                roommateGender:        1,
                roommatePreference:    1,
                age:                   1,
                diet:                  1,
                dietText:              1,
                shirtSize:             1,
                waiver:                1,
                resume:                1,
                submitted:             1,
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
        attending:             { type: Boolean },
        confirmTravellingFrom: { type: String },
        needBus:               { type: Boolean, optional: true },
        requireAccomodation:   { type: Boolean },
        roommateRequest:       { type: Boolean, optional: true },
        roommateRequestName:   { type: String, optional: true },
        roommateRequestEmail:  { type: String, optional: true },
        roommateGender:        { type: String, optional: true },
        roommatePreference:    { type: String, optional: true },
        age:                   { type: Boolean },
        diet:                  { type: Object, optional: true },
        'diet.vegetarian':     { type: Boolean },
        'diet.vegan':          { type: Boolean },
        'diet.gluten':         { type: Boolean },
        'diet.halal':          { type: Boolean },
        'diet.other':          { type: Boolean },
        dietText:              { type: String, optional: true },
        shirtSize:             { type: String },
        waiver:                { type: Boolean },
        resume:                { type: Boolean },
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
                attending:             rsvp.attending,
                confirmTravellingFrom: rsvp.confirmTravellingFrom,
                needBus:               rsvp.needBus,
                requireAccomodation:   rsvp.requireAccomodation,
                roommateRequest:       rsvp.roommateRequest,
                roommateRequestName:   rsvp.roommateRequestName,
                roommateRequestEmail:  rsvp.roommateRequestEmail,
                roommateGender:        rsvp.roommateGender,
                roommatePreference:    rsvp.roommatePreference,
                age:                   rsvp.age,
                diet:                  rsvp.diet,
                dietText:              rsvp.dietText,
                shirtSize:             rsvp.shirtSize,
                waiver:                rsvp.waiver,
                resume:                rsvp.resume,

                submitted:             true,
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
