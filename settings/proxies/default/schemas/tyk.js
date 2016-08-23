export default {
  tyk: {
    type: Object,
    optional: true
  },
  'tyk.url': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url
  },
  'tyk.apiKey': {
    type: String,
    optional: false
  },
  'tyk.authToken': {
    type: String,
    optional: false
  }
}
