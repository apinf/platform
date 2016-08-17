export default {
  kong: {
    type: Object,
    optional: true
  },
  'kong.url': {
    type: String,
    optional: false
  },
  'kong.apiKey': {
    type: String,
    optional: false
  },
  'kong.authToken': {
    type: String,
    optional: false
  },
}
