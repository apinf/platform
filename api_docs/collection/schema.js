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
    defaultValue: 'file',
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

// Attach schema to collection for validation, etc.
ApiDocs.attachSchema(ApiDocs.schema);
