import { Apis } from '/apis/collection/collection';

Apis.schema = new SimpleSchema({
  name: {
    type: String,
    optional: false
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3
    },
    optional: true
  },
  url: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url
  },
  documentationFileId: {
    type: String,
    optional: true
  },
  apiLogoFileId: {
    type: String,
    optional: true
  },
  documentation_link: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url
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
  },
  managerIds: {
    type: [String],
    regEx: SimpleSchema.RegEx.Id,
    defaultValue: [null],
    autoform: {
      type: "hidden",
      label: false
    }
  },
  averageRating: {
    type: Number,
    decimal: true,
    optional: true,
    autoform: {
      type: "hidden",
      label: false
    }
  },
  bookmarkCount: {
    type: Number,
    optional: true,
    autoform: {
      type: "hidden",
      label: false
    },
    defaultValue: 0
  },
  isPublic: {
    type: Boolean,
    optional: true,
    defaultValue: true
  }
});

Apis.attachSchema(Apis.schema);
