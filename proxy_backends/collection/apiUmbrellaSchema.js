// Utility import
import { proxyBasePathRegExp, apiBasePathRegExp } from './regex';

const ApiUmbrellaSchema = new SimpleSchema({
  'name': {
    type: String,
    optional: true,
  },
  'frontend_host': {
    type: String,
    optional: true,
    label: 'Proxy host',
  },
  'backend_host': {
    type: String,
    optional: true,
    label: 'API host',
  },
  'backend_protocol': {
    label: 'API host protocol',
    type: String,
    optional: true,
    allowedValues: [
      'http',
      'https',
    ],
  },
  'balance_algorithm': {
    type: String,
    optional: true,
    defaultValue: 'least_conn',
  },
  'url_matches': {
    type: [Object],
    optional: true,
  },
  'url_matches.$.frontend_prefix': {
    type: String,
    optional: true,
    label: 'Proxy base path',
    regExp: proxyBasePathRegExp,
  },
  'url_matches.$.backend_prefix': {
    type: String,
    optional: true,
    label: 'API base path',
    regExp: apiBasePathRegExp,
  },
  'servers': {
    type: [Object],
    optional: true,
  },
  'servers.$.host': {
    type: String,
    optional: true,
    label: 'API host',
  },
  'servers.$.port': {
    type: Number,
    optional: true,
    label: 'API port',
  },
});

export { ApiUmbrellaSchema };
