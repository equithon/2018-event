import SimpleSchema from 'simpl-schema';

Schema = {};

Schema.application = new SimpleSchema({
    name: {
        type: String,
        min: 5,
        max: 100
    },
    school: {
        type: String,
        min: 5,
        max: 100
    },
    yog: {
        type: Number,
        min: 1901,
        max: 2030
    },
    project: {
        type: String,
        max: 2000
    }
});

Schema.context = Schema.application.newContext();

Meteor.methods({
    submitApplication: function(application) {
        console.log("Received application from " + application.name);
        if(Schema.context.validate(application, Schema.application)) {
            console.log("Successfully validated the application");
        }
    }
});

export default Schema;