export default {
  apiUmbrella: {
    type: Object,
    optional: true,
  },
  'apiUmbrella.url': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
  'apiUmbrella.apiKey': {
    type: String,
    optional: false,
  },
  'apiUmbrella.authToken': {
    type: String,
    optional: false,
  },
  'apiUmbrella.elasticsearch': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
};
