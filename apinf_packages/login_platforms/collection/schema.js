/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import LoginPlatforms from './';

LoginPlatforms.schema = new SimpleSchema({
  githubConfiguration: {
    type: Object,
    optional: true,
  },
  'githubConfiguration.clientId': {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'githubConfiguration.secret': {
    type: String,
    optional: true,
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
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'fiwareConfiguration.secret': {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
  },
  'fiwareConfiguration.rootURL': {
    type: String,
    optional: true,
    autoform: {
      placeholder: 'xxx',
    },
  },
});

// Enable translations (i18n)
LoginPlatforms.schema.i18n('schemas.loginPlatforms');

LoginPlatforms.attachSchema(LoginPlatforms.schema);
