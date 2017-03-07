// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  apiUmbrella: {
    type: Object,
    optional: true,
  },
  'apiUmbrella.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'apiUmbrella.apiKey': {
    type: String,
  },
  'apiUmbrella.authToken': {
    type: String,
  },
  'apiUmbrella.elasticsearch': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
};
