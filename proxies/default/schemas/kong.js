export default {
  kong: {
    type: Object,
    optional: true
  },
  'kong.url': {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url
  },
  'kong.apiKey': {
    type: String,
    optional: false
  },
  'kong.authToken': {
    type: String,
    optional: false
  }
}
