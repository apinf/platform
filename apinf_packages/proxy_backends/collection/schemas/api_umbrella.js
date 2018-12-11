/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

// APInf imports
import { proxyBasePathRegEx, apiBasePathRegEx, subSettingRequestHeaderRegEx } from '../regex';

const RateLimitSchema = new SimpleSchema({
  duration: {
    type: Number,
    optional: true,
  },
  limit_by: {
    type: String,
    optional: true,
    autoform: {
      firstOption: false,
      options () {
        const commonList = [
          {
            label: 'API Key',
            value: 'apiKey',
          },
          {
            label: 'IP Address',
            value: 'ip',
          },
        ];

        const settings = Settings.findOne();
        const supportsGraphql = settings ? settings.supportsGraphql : false;

        if (supportsGraphql) {
          commonList.push({
            label: 'Origin Header',
            value: 'origin',
          });
        }

        return commonList;
      },
      defaultValue: 'apiKey',
    },
  },
  limit: {
    type: Number,
    optional: true,
  },
  response_headers: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
});

// Internationalize Rate limit schema texts
RateLimitSchema.i18n('schemas.proxyBackends.apiUmbrella.settings.rate_limit');

const SubSettings = new SimpleSchema({
  http_method: {
    type: String,
    optional: false,
    allowedValues: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'HEAD',
      'TRACE',
      'OPTIONS',
      'CONNECT',
      'PATCH',
    ],
  },
  regex: {
    type: String,
    optional: false,
  },
  settings: {
    type: Object,
    optional: true,
  },
  'settings.required_headers_string': {
    type: String,
    regEx: subSettingRequestHeaderRegEx,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
});

// Internationalize Rate limit schema texts
SubSettings.i18n('schemas.proxyBackends.apiUmbrella.sub_settings');

const SettingsSchema = new SimpleSchema({
  disable_api_key: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  rate_limit_mode: {
    type: String,
    optional: false,
    autoform: {
      firstOption: false,
      options () {
        const commonList = [
          {
            label () {
              return TAPi18n.__('apiUmbrellaProxyForm_rateLimitMode_options.unlimited');
            },
            value: 'unlimited',
          },
          {
            label () {
              return TAPi18n.__('apiUmbrellaProxyForm_rateLimitMode_options.custom');
            },
            value: 'custom',
          },
        ];

        const settings = Settings.findOne();
        const supportsGraphql = settings ? settings.supportsGraphql : false;

        if (supportsGraphql) {
          commonList.push({
            label () {
              return TAPi18n.__('apiUmbrellaProxyForm_rateLimitMode_options.custom-header');
            },
            value: 'custom-header',
          });
        }

        return commonList;
      },
      defaultValue: 'unlimited',
    },
  },
  rate_limit_cost_header: {
    type: String,
    optional: true,
  },
  rate_limits: {
    type: [RateLimitSchema],
    optional: true,
  },
  append_query_string: {
    type: String,
    optional: true,
  },
  headers_string: {
    type: String,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  idp_app_id: {
    type: String,
    optional: true,
  },
});

// Internationalize settings schema texts
SettingsSchema.i18n('schemas.proxyBackends.apiUmbrella.settings');

const ApiUmbrellaSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
  frontend_host: {
    type: String,
    optional: true,
    label: 'Proxy host',
  },
  backend_host: {
    type: String,
    optional: true,
    label: 'API host',
  },
  backend_protocol: {
    label: 'API host protocol',
    type: String,
    optional: true,
    allowedValues: [
      'http',
      'https',
    ],
  },
  balance_algorithm: {
    type: String,
    optional: true,
    defaultValue: 'least_conn',
  },
  url_matches: {
    type: [Object],
    optional: true,
  },
  'url_matches.$.frontend_prefix': {
    type: String,
    optional: true,
    unique: true,
    regEx: proxyBasePathRegEx,
    custom () {
      let validation = null;
      const admin = '/admin/';
      const result = this.value.includes(admin);
      if (this.value === '/signup/' || this.value === '/signin/' || result) {
        validation = 'invalidProxyBackendForm_forbiddenPrefixMessage';
      }
      return validation;
    },
  },
  'url_matches.$.backend_prefix': {
    type: String,
    optional: true,
    regEx: apiBasePathRegEx,
  },
  servers: {
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
  },
  settings: {
    type: SettingsSchema,
    optional: true,
  },
  sub_settings: {
    type: [SubSettings],
    optional: true,
  },
});

SimpleSchema.messages({ invalidProxyBackendForm_forbiddenPrefixMessage:
  TAPi18n.__('invalidProxyBackendForm_forbiddenPrefixMessage') });
// Internationalize API Umbrella schema texts
ApiUmbrellaSchema.i18n('schemas.proxyBackends.apiUmbrella');

export default ApiUmbrellaSchema;
