// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  emqtt: {
    type: Object,
    optional: true,
  },
  'emqtt.url': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  'emqtt.elasticsearch': {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
};
