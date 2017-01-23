import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import Organizations from './';

Organizations.schema = new SimpleSchema({
  contact: {
    type: Object,
    optional: true,
  },
  'contact.person': {
    type: String,
    optional: true,
  },
  'contact.phone': {
    type: String,
    optional: true,
  },
  'contact.email': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
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
    autoform: {
      type: 'hidden',
      label: false,
    },
    autoValue () {
      // Automatically add the current user to manager IDs array, on insert
      if (this.isInsert) {
        return [Meteor.userId()];
      }

      // Don't allow users to provide a value
      // Note, this may need to change when we allow adding other managers
      return this.unset();
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

      return this.unset();
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
      return this.unset();
    },
  },
  updatedAt: {
    type: Date,
    optional: true,
    autoValue () {
      if (this.isUpdate) {
        return new Date();
      }

      return this.unset();
    },
  },
});

// Enable translations (i18n)
Organizations.schema.i18n('schemas.organizations');

Organizations.attachSchema(Organizations.schema);
