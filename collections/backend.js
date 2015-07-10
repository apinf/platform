ApiBackends = new Mongo.Collection('apiBackends');

ApiBackendsSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true
  },
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
    optional: true,
    allowedValues: [
      'least_conn',
      'round_robin',
      'ip_hash'
    ],
    label: 'Balance algorithm'
  },
  server: {
    type: [Object],
    optional: true,
    label: 'Host'
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
    label: 'Frontend prefix',
    optional: true,
    type: String
  },
  "matching.$.backend_prefix": {
    label: 'Backend prefix',
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
    label: 'HTTP method',
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
      rows: 2,
      placeholder: 'X-Example-Header: value'
    },
    label: 'Set headers'
  },
  append_query_string: {
    type: String,
    optional: true,
    label: 'Append query string parameters',
    autoform: {
      placeholder: 'param1=value&param2=value'
    }
  },
  http_basic_auth: {
    type: String,
    optional: true,
    label: 'HTTP basic authentication',
    autoform: {
      placeholder: 'username:password'
    }
  },
  require_https: {
    type: String,
    optional: true,
    allowedValues: [
      'Inherit (default - optional)',
      'Optional - HTTPS is optional',
      'Required - HTTPS is mandatory'
    ],
    label: 'HTTPS requirements'
  },
  require_https_transition_start_at: {
    label: 'Require HTTPS transition starts at:',
    type: Date,
    optional: true
  },
  disable_api_key: {
    type: Boolean,
    optional: true
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
    type: Date,
    optional: true
  },
  required_roles: {
    type: Array,
    minCount: 2,
    maxCount: 3,
    optional: true,
    label: 'Required roles',
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
    type: String,
    optional: true
  },
  rate_limit_mode: {
    type: String,
    optional: true,
    allowedValues: [
      'Default rate limits',
      'Custom rate limits',
      'Unlimited requests'
    ],
    label: 'Rate limit'
  },
  anonymous_rate_limit_behavior: {
    type: String,
    optional: true
  },
  authenticated_rate_limit_behavior: {
    type: String,
    optional: true
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
    type: [Object],
    optional: true,
  },
  "error_templates.$.json": {
    type: String,
    optional: true,
  },
  "error_templates.$.xml": {
    type: String,
    optional: true,
  },
  "error_templates.$.csv": {
    type: String,
    optional: true,
  },
  error_data: {
    type: [Object],
    optional: true,
  },
  "error_data.$.api_key_missing": {
    type: [Object],
    optional: true,
  },
  "api_key_missing.$.status_code": {
    type: Number,
    optional: true,
  },
  "api_key_missing.$.code": {
    type: String,
    optional: true,
  },
  "api_key_missing.$.message": {
    type: String,
    optional: true,
  },
  "error_data.$.api_key_invalid": {
    type: [Object],
    optional: true
  },
  "api_key_invalid.$.status_code": {
    type: Number,
    optional: true,
  },
  "api_key_invalid.$.code": {
    type: String,
    optional: true,
  },
  "api_key_invalid.$.message": {
    type: String,
    optional: true,
  },
  "error_data.$.api_key_disabled": {
    type: [Object],
    optional: true,
  },
  "api_key_disabled.$.status_code": {
    type: Number,
    optional: true,
  },
  "api_key_disabled.$.code": {
    type: String,
    optional: true,
  },
  "api_key_disabled.$.message": {
    type: String,
    optional: true,
  },
  "error_data.$.api_key_unauthorized": {
    type: [Object],
    optional: true,
  },
  "api_key_unauthorized.$.status_code": {
    type: Number,
    optional: true,
  },
  "api_key_unauthorized.$.code": {
    type: String,
    optional: true,
  },
  "api_key_unauthorized.$.message": {
    type: String,
    optional: true,
  },
  "error_data.$.over_rate_limit": {
    type: [Object],
    optional: true,
  },
  "over_rate_limit.$.status_code": {
    type: Number,
    optional: true,
  },
  "over_rate_limit.$.code": {
    type: String,
    optional: true,
  },
  "over_rate_limit.$.message": {
    type: String,
    optional: true,
  },
  created_at: {
    type: Date,
    optional: true
  },
  created_by: {
    type: String,
    optional: true
  },
  updated_at: {
    type: Date,
    optional: true
  },
  updated_by: {
    type: String,
    optional: true
  },
  version: {
    type: Number,
    optional: true
  }
});

ApiBackends.attachSchema(ApiBackendsSchema);

