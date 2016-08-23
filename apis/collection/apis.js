const Apis = new Mongo.Collection('apis');

Apis.schema = new SimpleSchema({
  name: {
    label: "API Name",
    type: String,
    optional: false
  },
  description: {
    label: "Description",
    type: String,
    max: 1000,
    autoform: {
      rows: 3
    },
    optional: true
  },
  url: {
    label: "URL",
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
    autoform: {
      type: "hidden",
      label: false
    }
  },
  created_by: {
    type: String,
    autoform: {
      type: "hidden",
      label: false
    }
  },
  updated_at: {
    type: Date,
    autoform: {
      type: "hidden",
      label: false
    }
  },
  updated_by: {
    type: String,
    autoform: {
      type: "hidden",
      label: false
    }
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

export { Apis };
