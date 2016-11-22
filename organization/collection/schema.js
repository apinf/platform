import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Organizations } from './';

Organizations.schema = new SimpleSchema({
  organizationLogoFileId: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },
  username: {
    type: String,
  },
  description: {
    type: String,
    max: 1000,
    autoform: {
      rows: 3,
    },
    optional: true,
  },
  contactPerson: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
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
  updated_at: {
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

Organizations.attachSchema(Organizations.schema);
