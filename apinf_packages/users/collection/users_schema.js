/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
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
// Username must be 3-15 alphanumeric string combinations with hyphens and underscore allowed
// Username cannot begin with a hypen , underscore
const UsernameRegEx = /^(?!-)(?!_)[a-zA-Z0-9-_]{3,15}$/;

const UserSchema = new SimpleSchema({
  username: {
    type: String,
    regEx: UsernameRegEx,
    optional: false,
    autoValue () {
      // If Fiware was used
      const fiware = (this.field('services').value || {}).fiware;

      // If Github was used
      const github = (this.field('services').value || {}).github;

      // Check login service used
      if (fiware) {
        return fiware.displayName;
        // If Github was used, get Github username
      } else if (github) {
        return github.username;
      }
      // If regular signup was used, get passed username
      return this.value;
    },
  },
  apiUmbrellaUserId: {
    type: String,
    optional: true,
  },
  emails: {
    type: [Object],
    optional: true,
    autoValue () {
      // Set fiware object to variable
      const fiware = (this.field('services').value || {}).fiware;

      // Set Github object to variable
      const github = (this.field('services').value || {}).github;

      // If Fiware was used, get Fiware email
      if (fiware) {
        return [{ address: fiware.email, verified: false }];

      // If Github was used, get Github email
      } else if (github) {
        return [{ address: github.email, verified: false }];
      }

      // If regular signup was used, get passed email
      return this.value;
    },
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

// Enable translations (i18n)
UserSchema.i18n('schemas.users');

Meteor.users.attachSchema(UserSchema);
