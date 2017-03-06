// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import ApiBackendRatings from './';

ApiBackendRatings.schema = new SimpleSchema({
  apiBackendId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  rating: {
    type: Number,
    min: 0,
    max: 4,
  },
});

ApiBackendRatings.attachSchema(ApiBackendRatings.schema);
