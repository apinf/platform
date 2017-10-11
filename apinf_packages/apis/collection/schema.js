/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Collection imports
import Apis from './';

Apis.schema = new SimpleSchema({
  name: {
    type: String,
    optional: false,
    // API Name should be unique for
      // synchronization with proxy
      // distinct catalog entries
    unique: true,
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  url: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
  slug: {
    type: String,
    optional: true,
    unique: true,
  },
  latestMonitoringStatusCode: {
    type: String,
    optional: true,
  },
  lifecycleStatus: {
    type: String,
    optional: true,
    allowedValues: [
      'development',
      'deprecated',
      'design',
      'production',
      'testing',
    ],
  },
  apiLogoFileId: {
    type: String,
    optional: true,
  },
  authorizedUserIds: {
    type: [String],
    optional: true,
    defaultValue: [], // Default to empty array, for addAuthorizedUser method
  },
  monitoringId: {
    type: String,
    optional: true,
  },
  created_at: {
    type: Date,
    optional: true,
    autoValue () {
      let value;
      if (this.isInsert) {
        value = new Date();
      } else if (this.isUpsert) {
        value = { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
      return value;
    },
  },
  created_by: {
    type: String,
    optional: true,
  },
  updated_at: {
    type: Date,
    optional: true,
    autoValue () {
      let value;
      if (this.isUpdate) {
        value = new Date();
      }
      return value;
    },
  },
  updated_by: {
    type: String,
    optional: true,
  },
  version: {
    type: Number,
    optional: true,
  },
  managerIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: [null],
    autoform: {
      type: 'hidden',
      label: false,
    },
  },
  averageRating: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false,
    },
  },
  bookmarkCount: {
    type: Number,
    optional: true,
    autoform: {
      type: 'hidden',
      label: false,
    },
    defaultValue: 0,
  },
  isPublic: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  feedbackIsPublic: {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
});

// Enable translations (i18n)
Apis.schema.i18n('schemas.apis');

Apis.attachSchema(Apis.schema);
