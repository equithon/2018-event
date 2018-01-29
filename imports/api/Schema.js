import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker'; // Enable validation error reactivity

/* Ensure that simpl-schema errors are translated to Meteor validation errors */
SimpleSchema.defineValidationErrorTransform(error => {
    const ddpError = new Meteor.Error(error.message);
    ddpError.error = 'validation-error';
    ddpError.details = error.details;
    return ddpError;
});

Schema = {};

/* Application submission schema */
Schema.applicationSubmit = new SimpleSchema({
    ghURL: {
        type: String,
    },
    liURL: {
        type: String,
    },
    school: {
        type: String,
    },
    yog: {
        type: Number,
        min: 1901,
        max: 2030,
    },
    project: {
        type: String,
        max: 2000,
    },
    userId: {
        type: String,
    },
    submitted: {
        type: Boolean,
    },
}, { tracker: Tracker }); // hook

/* Application save schema (keys become optional) */
Schema.applicationSave = new SimpleSchema({
    ghURL: {
        type: String,
        optional: true,
    },
    liURL: {
        type: String,
        optional: true,
    },
    school: {
        type: String,
        optional: true,
    },
    yog: {
        type: Number,
        optional: true,
        min: 1901,
        max: 2030,
    },
    project: {
        type: String,
        optional: true,
        max: 2000,
    },
    userId: {
        type: String,
    },
    submitted: {
        type: Boolean,
    },
});

/* Configure appplication schema */
export const clientSubmitSchema = Schema.applicationSubmit.omit('userId'); // The client submits their application without userId.
export const clientSaveSchema = Schema.applicationSave.omit('userId'); // The server is the one that adds this field.

export default Schema;
