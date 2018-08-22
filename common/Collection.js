import Schema from './Schema'

const applicationCollectionName = "applications";

const Applications = new Mongo.Collection(applicationCollectionName);

Applications.attachSchema(Schema.application);

export default Applications;