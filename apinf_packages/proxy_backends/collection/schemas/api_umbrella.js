/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

// APInf imports
import { proxyBasePathRegEx, apiBasePathRegEx } from '../regex';

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
          { label: 'API Key', value: 'apiKey' },
          { label: 'IP Address', value: 'ip' },
        ];

        const settings = Settings.findOne();
        const supportsGraphql = settings ? settings.supportsGraphql : false;

        if (supportsGraphql) {
          commonList.push({ label: 'Origin Header', value: 'originHeader' });
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
  originHeaderOptions: {
    type: String,
    optional: true,
    autoform: {
      type: 'select-radio',
      defaultValue: 'constant',
      options: () => {
        return [
          {
            label: 'Constant (every request costs 1 unit)', value: 'constant',
          },
          {
            label: 'Returned in the header', value: 'header',
          },
        ];
      },
    },
  },
  headerName: {
    type: String,
    optional: true,
  },
  totalCost: {
    type: String,
    optional: true,
  },
});

// Internationalize Rate limit schema texts
RateLimitSchema.i18n('schemas.proxyBackends.apiUmbrella.settings.rate_limit');

const SettingsSchema = new SimpleSchema({
  disable_api_key: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  rate_limit_mode: {
    type: String,
    optional: false,
    allowedValues: [
      'custom',
      'unlimited',
    ],
    defaultValue: 'unlimited',
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
});

// Internationalize API Umbrella schema texts
ApiUmbrellaSchema.i18n('schemas.proxyBackends.apiUmbrella');

export default ApiUmbrellaSchema;
