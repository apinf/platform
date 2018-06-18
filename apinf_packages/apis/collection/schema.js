/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
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
    autoform: {
      placeholder: 'e.g. Tampere Bus Service',
    },
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
      placeholder: `e.g. Plan your journey across Tampere city with latest bus information,
      real-time vehicle location and inter zone routing. You can lookup bus times by line
      and stoppage.`,
    },
    optional: true,
  },
  url: {
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
    autoform: {
      placeholder: "e.g. https://tampere-bus-service.fi",
    },
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
    autoValue () {
      let createdBy;
      if (this.isInsert) {
        createdBy = this.value || Meteor.userId();
      }
      return createdBy;
    },
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
    autoValue () {
      let updateBy;
      if (this.isUpdate) {
        updateBy = this.value || Meteor.userId();
      }
      return updateBy;
    },
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
  'friendlySlugs.slug.base': {
    type: String,
    optional: true,
  },
  'friendlySlugs.slug.index': {
    type: Number,
    optional: true,
  },
});

// Enable translations (i18n)
Apis.schema.i18n('schemas.apis');

Apis.attachSchema(Apis.schema);
