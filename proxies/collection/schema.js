import { Proxies } from './';
import proxiesList from '../proxiesList';

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
    allowedValues: proxiesList
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
