// Utility import
import { proxyBasePathRegEx, apiBasePathRegEx } from './regex';

const ApiUmbrellaSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
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
    unique: true,
    label: 'Proxy base path',
    regEx: proxyBasePathRegEx,
  },
  'url_matches.$.backend_prefix': {
    type: String,
    optional: true,
    label: 'API base path',
    regEx: apiBasePathRegEx,
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

ApiUmbrellaSchema.messages({
  // unique field error message
  notUnique: "Not unique."
});

export { ApiUmbrellaSchema };
