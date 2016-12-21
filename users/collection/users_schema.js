import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';

const UserProfileSchema = new SimpleSchema({
  name: {
    type: String,
    optional: true,
  },
  company: {
    type: String,
    optional: true,
  },
});
// Username must be 3-15 alphanumeric string with hyphens allowed.
const UsernameRegEx = /^(?!\d)(?!.*-.*-)(?!.*-$)(?!-)[a-zA-Z0-9-_]{3,15}$/;

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: UsernameRegEx,
    optional: false,
  },
  apiUmbrellaUserId: {
    type: String,
    optional: true,
  },
  emails: {
    type: [Object],
    optional: false,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: UserProfileSchema,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  roles: {
    type: [String],
    blackbox: true,
    optional: true,
  },
});

// Fetch username invalid message
const usernameInvalid = TAPi18n.__('profile_usernameInvalid');

// Define custom validation error messages
UserSchema.messages({
  'regEx username': [
    { exp: UsernameRegEx, msg: usernameInvalid },
  ],
});

Meteor.users.attachSchema(UserSchema);
