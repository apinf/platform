import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default {
  emqtt: {
    type: Object,
    optional: true,
  },
  'emqtt.url': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
  // TODO: decide if these fields are needed for emqtt..
  // 'emqtt.apiKey': {
  //   type: String,
  //   optional: false,
  // },
  // 'emqtt.authToken': {
  //   type: String,
  //   optional: false,
  // },
  'emqtt.elasticsearch': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
};
