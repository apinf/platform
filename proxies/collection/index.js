import initialProxies from '../initialProxies';

const Proxies = new Mongo.Collection('proxies');

Proxies.schema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String,
    autoform: {
      rows: 5
    }
  },
  type: {
    type: String,
    allowedValues: initialProxies
  },
  apiUmbrella: {
    type: Object,
    optional: true
  },
  'apiUmbrella.url': {
    type: String
  },
  'apiUmbrella.apiKey': {
    type: String
  },
  'apiUmbrella.authToken': {
    type: String
  },
  'apiUmbrella.elasticsearch': {
    type: String
  },
  kong: {
    type: Object,
    optional: true
  },
  'kong.url': {
    type: String
  },
  'kong.apiKey': {
    type: String
  },
  'kong.authToken': {
    type: String
  },
  tyk: {
    type: Object,
    optional: true
  },
  'tyk.url': {
    type: String
  },
  'tyk.apiKey': {
    type: String
  },
  'tyk.authToken': {
    type: String
  }
});

Proxies.attachSchema(Proxies.schema);

Proxies.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

export { Proxies };
