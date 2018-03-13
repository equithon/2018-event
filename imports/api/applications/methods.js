import { Meteor } from 'meteor/meteor';

import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { clientSubmitSchema, clientSaveSchema } from '/imports/api/Schema.js';
import Applications from './applications.js';
import { rateLimit } from '../RateLimiter.js';


/*
 * Publish the fields of the application to the user who owns the application.
 */
Meteor.publish('applicationData', function() {
    if (this.userId) {
        return Applications.find({ userId: this.userId }, {
            fields: {
                program:           1,
                travellingFrom:    1,
                institution:       1,
                cityOfInstitution: 1,
                yog:               1,
                longAnswer:        1,
                eduLevel:          1,
                gender:            1,
                goals:             1,
                categories:        1,
                workshops:         1,
                submitted:         1,
            }
        });
    } else {
        this.ready();
    }
});

/*
 * Submit the application provided the user hasn't already
 * submitted an application.
 */
export const submitApplication = new ValidatedMethod({
    name: 'applications.submit',

    validate: clientSubmitSchema.validator(),

    run(application) {
        /* Validate user is logged in in order to submit application */
        if (!this.userId) {
            throw new Meteor.Error('applications.submit.unauthorized',
                'Please log in to submit your application');
        }

        let user = Meteor.users.find({ _id: this.userId }).fetch()[0];

        /* Validate user is verified in order to submit application */
        if (!user.emails[0].verified) {
            throw new Meteor.Error('applications.submit.unverified',
                'You must verify your email address first in order to submit your application');
        }

        let app = Applications.find({ userId: this.userId }).fetch()[0];

        /* Validate application has been saved first */
        if (!app) {
            throw new Meteor.Error('applications.submit.not_saved',
                'Please save your application first');
        }

        /* Validate application has not already been submitted by this user */
        if (app.submitted) {
            throw new Meteor.Error('applications.submit.already_submitted',
                'You have already submitted your application');
        }

        /* Submit the application */
        Applications.update({ userId: this.userId }, {
            $set: {
                program:                application.program,
                institution:            application.institution,
                cityOfInstitution:      application.cityOfInstitution,
                yog:                    application.yog,
                travellingFrom:         application.travellingFrom,
                longAnswer:             application.longAnswer,
                eduLevel:               application.eduLevel,
                gender:                 application.gender,
                goals:                  application.goals,
                categories:             application.categories,
                workshops:              application.workshops,
                submitted: true,
            }
        });
    }
});

/*
 * Save the application.
 */
export const saveApplication = new ValidatedMethod({
    name: 'applications.save',

    validate: clientSaveSchema.validator(),

    run(application) {
        /* Validate user is logged in in order to save application */
        if (!this.userId) {
            throw new Meteor.Error('application.save.unauthorized',
                'Please log in to save your application');
        }

        let user = Meteor.users.find({ _id: this.userId }).fetch()[0];

        /* Validate user is verified in order to save application */
        if (!user.emails[0].verified) {
            throw new Meteor.Error('applications.save.unverified',
                'You must verify your email address first in order to save your application');
        }

        /* Validate application has not already been submitted */
        let app = Applications.find({ userId: this.userId }).fetch()[0];
        if (app && app.submitted) {
            throw new Meteor.Error('applications.save.already_submitted',
                'You have already submitted your application');
        }

        /* Save the application */
        Applications.upsert({ userId: this.userId }, {
            $set: {
                userId:                 this.userId,
                program:                application.program,
                institution:            application.institution,
                cityOfInstitution:      application.cityOfInstitution,
                yog:                    application.yog,
                travellingFrom:         application.travellingFrom,
                longAnswer:             application.longAnswer,
                eduLevel:               application.eduLevel,
                gender:                 application.gender,
                goals:                  application.goals,
                categories:             application.categories,
                workshops:              application.workshops,
                submitted: false,
            }
        }, (err, res) => {
            if (err) throw err;
        });
    }
});

/*
 * Returns the next application needing review and undefined if there are no applications
 * needing review.
 */
export const getNextAppForReview = new ValidatedMethod({
    name: 'applications.getNextAppForReview',

    validate: null,

    run(application) {
        /* Verify user is logged in */
        if (!this.userId) throw new Meteor.Error('applications.getNextAppForReview.unauthorized',
            'You need to be logged in to review applications');

        /* Verify user is a team member */
        var user = Meteor.user();
        if (!user.isTeam) throw new Meteor.Error('applications.getNextAppForReview.unauthorizedUser',
            'You must be a member of the Equithon team to review applications');

        /* Find a submitted application that has less than 2 reviewers */
        var appToReview = Applications.findOne({
            submitted: true,
            $or: [
                { ratings: { $exists: false } },                    // No ratings OR
                { $and: [                                           //
                    { 'ratings.1': { $exists: false } },            // less than 2 ratings AND
                    { 'ratings.0.reviewer': { $ne: this.userId } }  // we have not rated it yet
                ]}
            ]
        }, {
            fields: {
                experience: 1,
                hackathon: 1,
                hearAbout: 1,
                goals: 1,
                categories: 1,
                workshops: 1,
                longAnswer: 1,
                ratings: 1,
            }
        });


        if (appToReview) delete appToReview.ratings;
        return appToReview;
    }
});

/*
 * Submits the ratings made by logged in team member for a given application.
 */
export const submitRating = new ValidatedMethod({
    name: 'applications.submitRating',

    validate: new SimpleSchema({
        appId: { type: String },
        passion: { type: Number, min: 0, max: 5 },
    }).validator(),

    run(rating) {
        /* Verify user is logged in */
        if (!this.userId) throw new Meteor.Error('applications.submitRating.unauthorized',
            'You need to be logged in to submit ratings');

        /* Verify user is a team member */
        var user = Meteor.user();
        if (!user.isTeam) throw new Meteor.Error('applications.submitRating.unauthorizedUser',
            'You must be a member of the Equithon team to submit ratings');

        /* Verify application exists */
        var app = Applications.findOne({ _id: rating.appId });
        if (!app) throw new Meteor.Error('applications.submitRating.applicationNotFound',
            'Application does not exist');

        if (app.ratings && app.ratings.find(function(rating) {
            return (rating.reviewer === this.userId) ? rating : undefined;
        }.bind(this))) {
            throw new Meteor.Error('applications.submitRating.alreadyReviewed', 'Application already reviewed');
        }

        /* Update the application corresponding to the given appId and a new rating and reviewer */
        Applications.update({ _id: rating.appId} , {
            $push: {
                ratings: {
                    reviewer: this.userId,
                    passion: rating.passion,
                }
            }
        });
    }
});


/*
 * Stricter rate limiting
 */
if (Meteor.isServer) {
    rateLimit({
        methods: [
            submitApplication, saveApplication
        ],
        limit: 1,
        timeRange: 3000,
    });
}
