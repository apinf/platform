ApiBackends = new Meteor.Collection('apiBackends');
Schemas.ApiBackends = new SimpleSchema({
  name: {
    type: String
  },
  sort_order: {
    type: Integer
  },
  backend_protocol: {
    type: String,
    allowedValues: ['http', 'https'],
    label: 'Backend protocol'
  },
  backend_host: {
    type: String
  },
  backend_port: {
    type: Number
  },
  frontend_host: {
    type: String
  },
  balance_algorithm: {
    type: String
  },
  server: {
    type: [Object]
  },
  "server.$.backend_host": {
    type: String
  },
  "server.$.backend_port": {
    type: String,
    regEx: /^[0-9]{2,5}$/
  },
  matching: {
    type: [Object]
  },
  "matching.$.frontend_prefix": {
    label: 'Frontend Prefix',
    type: String
  },
  "matching.$.backend_prefix": {
    label: 'Backend Prefix',
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  duration: {
    type: Number
  },
  accuracy:{
    type: Number
  },
  limit_by: {
    type: String
  },
  limit: {
    type: Number
  },
  distributed: {
    type: Boolean
  },
  response_headers: {
    type: Boolean
  },
  matcher_type: {
    type: String
  },
  http_method: {
    type: String
  },
  frontend_matcher: {
    type: String
  },
  backend_replacement: {
    type: String
  },
  matcher: {
    type: String
  },
  http_method: {
    type: String
  },
  from: {
    type: String
  },
  to: {
    type: String
  },
  set_headers: {
    type: [Object]
  },
  append_query_string: {
    type: String
  },
  http_basic_auth: {
    type: String
  },
  require_https: {
    type: String
  },
  require_https_transition_start_at: {
    type: Date
  },
  disable_api_key: {
    type: Boolean
  },
  api_key_verification_level: {
    type: String
  },
  api_key_verification_transition_start_at: {
    type: Date
  },
  required_roles: {
    type: Array
  },
  rate_limit_mode: {
    type: String
  },
  anonymous_rate_limit_behavior: {
    type: String
  },
  authenticated_rate_limit_behavior: {
    type: String
  },
  pass_api_key_header: {
    type: Boolean
  },
  pass_api_key_query_param: {
    type: Boolean
  },
  error_templates: {
    type: [Object]
  },
  error_data: {
    type: [Object]
  }
});

ApiBackends.attachSchema(Schemas.ApiBackends)
