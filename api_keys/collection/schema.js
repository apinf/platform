// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import ApiKeys from './';

// Schema for API Umbrella user
const apiUmbrellaUserSchema = new SimpleSchema({
  id: {
    type: String,
    optional: false,
  },
  apiKey: {
    type: String,
    optional: false,
  },
});

ApiKeys.schema = new SimpleSchema({
  apiUmbrella: {
    type: apiUmbrellaUserSchema,
    optional: true,
  },
  userId: {
    type: String,
    optional: false,
  },
  proxyId: {
    type: String,
    optional: false,
  },
});

ApiKeys.attachSchema(ApiKeys.schema);
