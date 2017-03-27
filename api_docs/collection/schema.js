/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import ApiDocs from './';

ApiDocs.schema = new SimpleSchema({
  type: {
    type: String,
    optional: false,
    allowedValues: [
      'url',
      'file',
    ],
    defaultValue: 'url',
  },
  fileId: {
    type: String,
    optional: true,
  },
  remoteFileUrl: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  otherUrl: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  submit_methods: {
    type: [String],
    optional: true,
  },
  apiId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
});

// Enable translations (i18n)
ApiDocs.schema.i18n('schemas.apiDocs');

// Attach schema to collection for validation, etc.
ApiDocs.attachSchema(ApiDocs.schema);
