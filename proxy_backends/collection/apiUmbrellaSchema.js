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
  },
  'url_matches.$.backend_prefix': {
    type: String,
    optional: true,
    label: 'API base path',
  },
  'servers': {
    type: [Object],
    optional: true,
  },
  'servers.$.host': {
    type: String,
    optional: true,
    label: 'Proxy host',
  },
  'servers.$.port': {
    type: Number,
    optional: true,
    label: 'Proxy port',
  },
});

export { ApiUmbrellaSchema };
