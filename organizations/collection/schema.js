import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Organizations } from './';

Organizations.schema = new SimpleSchema({
  contact: {
    type: Object,
    optional: true,
  },
  'contact.person': {
    type: String,
  },
  'contact.phone': {
    type: String,
  },
  'contact.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
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
  name: {
    type: String,
  },
  organizationLogoFileId: {
    type: String,
    optional: true,
  },
  slug: {
    type: String,
    optional: false,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  /* Internal fields, create, update tracking */
  createdBy: {
    type: String,
    autoValue () {
      if (this.isInsert) {
        return Meteor.userId();
      }

      this.unset();
    },
    denyUpdate: true,
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      // Prevent user from supplying their own value
      this.unset();
    },
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isUpdate) {
        return new Date();
      }

      this.unset();
    },
  },
});

// Enable translations (i18n)
Organizations.schema.i18n('schemas.organizations');

Organizations.attachSchema(Organizations.schema);
