ApiBackends = new Mongo.Collection('apiBackends');

ApiBackendsSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true
  },
  sort_order: {
    type: Number,
    optional: true
  },
  backend_protocol: {
    type: String,
    optional: true,
    allowedValues: [
      'http',
      'https'
    ],
    label: 'Backend protocol'
  },
  backend_host: {
    type: String,
    optional: true
  },
  backend_port: {
    type: Number,
    optional: true
  },
  frontend_host: {
    type: String,
    optional: true
  },
  balance_algorithm: {
    type: String,
    optional: true
  },
  server: {
    type: [Object],
    optional: true
  },
  "server.$.backend_host": {
    type: String,
    optional: true
  },
  "server.$.backend_port": {
    type: String,
    optional: true,
    regEx: /^[0-9]{2,5}$/
  },
  matching: {
    type: [Object],
    optional: true,
  },
  "matching.$.frontend_prefix": {
    label: 'Frontend Prefix',
    optional: true,
    type: String
  },
  "matching.$.backend_prefix": {
    label: 'Backend Prefix',
    optional: true,
    type: String,
    regEx: /^[a-z0-9A-Z_]{3,15}$/
  },
  duration: {
    type: Number,
    optional: true,
    label: 'Duration'
  },
  accuracy:{
    type: Number,
    optional: true
  },
  limit_by: {
    type: String,
    optional: true
  },
  limit: {
    type: Number,
    optional: true
  },
  distributed: {
    type: Boolean,
    optional: true
  },
  response_headers: {
    type: Boolean,
    optional: true
  },
  matcher_type: {
    type: String,
    optional: true
  },
  http_method: {
    type: String,
    optional: true
  },
  frontend_matcher: {
    type: String,
    optional: true
  },
  backend_replacement: {
    type: String,
    optional: true
  },
  matcher: {
    type: String,
    optional: true
  },
  http_method: {
    type: String,
    optional: true
  },
  from: {
    type: String,
    optional: true
  },
  to: {
    type: String,
    optional: true
  },
  set_headers: {
    type: String,
    optional: true,
    min: 20,
      max: 1000,
      autoform: {
         rows: 2
      },
    label: 'Set Headers'
  },
  append_query_string: {
    type: String,
    optional: true,
    label: 'Append Query String Parameters'
  },
  http_basic_auth: {
    type: String,
    optional: true,
    label: 'HTTP Basic Authentication'
  },
  require_https: {
    type: String,
    optional: true,
    allowedValues: [
      'Inherit (default - optional)',
      'Optional - HTTPS is optional',
      'Required - HTTPS is mandatory'
    ],
    label: 'HTTPS Requirements'
  },
  require_https_transition_start_at: {
    type: Date
  },
  disable_api_key: {
    type: Boolean
  },
  api_key_verification_level: {
    type: String,
    optional: true,
    allowedValues: [
      'Inherit (default - required)',
      'Required - API keys are mandatory',
      'Disabled - API keys are optional'
    ],
    label: 'API Key Checks'
  },
  api_key_verification_transition_start_at: {
    type: Date
  },
  required_roles: {
    type: Array,
    minCount: 1,
    maxCount: 3,
    optional: true,
    label: 'Required Roles',
    autoform: {
      options: [
        {
          label: 'api-umbrella-contact-form',
          value: 'api-umbrella-contact-form'
        },
        {
          label: 'api-umbrella-key-creator',
          value: 'api-umbrella-key-creator'
        },
        {
          label: 'write_access',
          value: 'write_access'
        }
      ]
    }
  },
  "required_roles.$": {
      type: String
   },
  rate_limit_mode: {
    type: String,
    allowedValues: [
      'Default rate limits',
      'Custom rate limits',
      'Unlimited requests'
    ],
    label: 'Rate limit'
  },
  anonymous_rate_limit_behavior: {
    type: String
  },
  authenticated_rate_limit_behavior: {
    type: String
  },
  pass_api_key_header: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    label: 'Via HTTP header'
  },
  pass_api_key_query_param: {
    type: Boolean,
    optional: true,
    defaultValue: false,
    label: 'Via GET query parameter'
  },
  error_templates: {
//    type: [Object]
    type: String
  },
  error_data: {
//    type: [Object]
    type: String
  }
});

ApiBackends.attachSchema(ApiBackendsSchema);

