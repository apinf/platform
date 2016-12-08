import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Organizations } from '/organizations/collection';
import { Apis } from './';

Apis.schema = new SimpleSchema({
  name: {
    label: 'API Name',
    type: String,
    optional: false,
    // API Name should be unique for
      // synchronization with proxy
      // distinct catalog entries
    unique: true,
  },
  description: {
    label: 'Description',
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  url: {
    label: 'URL',
    type: String,
    optional: false,
    regEx: SimpleSchema.RegEx.Url,
  },
  organizationId: {
    type: String,
    optional: true,
    autoform: {
      options: function () {
        return _.map(Organizations.find().fetch(), function (organization) {
          return {
            label: organization.name,
            value: organization._id,
          };
        });
      },
    },
  },
  documentationFileId: {
    type: String,
    optional: true,
  },
  latestMonitoringStatusCode: {
    type: String,
    optional: true,
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
  documentation_link: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  submit_methods: {
    type: [String],
    optional: true,
  },
  created_at: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
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
      if (this.isUpdate) {
        return new Date();
      }
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
});

// Enable translations (i18n)
Apis.schema.i18n('schemas.apis');

Apis.attachSchema(Apis.schema);
