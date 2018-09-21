/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import LoginPlatforms from './';

// Define LoginPlatforms schema
LoginPlatforms.schema = new SimpleSchema({
  githubConfiguration: {
    type: Object,
    optional: true,
  },
  'githubConfiguration.clientId': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'githubConfiguration.secret': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  fiwareConfiguration: {
    type: Object,
    optional: true,
  },
  'fiwareConfiguration.clientId': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'fiwareConfiguration.secret': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'fiwareConfiguration.rootURL': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  oidcConfiguration: {
    type: Object,
    optional: true,
  },
  'oidcConfiguration.clientId': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'oidcConfiguration.secret': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'oidcConfiguration.serverUrl': {
    type: String,
    optional: false,
    autoform: {
      placeholder: 'https://secure-server.fi',
    },
  },
  'oidcConfiguration.authorizationEndpoint': {
    type: String,
    optional: true,
    autoform: {
      placeholder: '/auth',
    },
  },
  'oidcConfiguration.tokenEndpoint': {
    type: String,
    optional: true,
    autoform: {
      placeholder: '/token',
    },
  },
  'oidcConfiguration.userinfoEndpoint': {
    type: String,
    optional: true,
    autoform: {
      placeholder: '/userInfo',
    },
  },
});

// Enable translations (i18n)
LoginPlatforms.schema.i18n('schemas.loginPlatforms');

// Attach the schema to the module
LoginPlatforms.attachSchema(LoginPlatforms.schema);
