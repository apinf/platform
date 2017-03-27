/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import { ApiUmbrellaAdmins, ApiUmbrellaUsers } from './';

// Describe collection for store Api Umbrella Admins
const ApiUmbrellaAdminsSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
  username: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
  notes: {
    type: String,
    optional: true,
  },
  superuser: {
    type: Boolean,
    optional: true,
  },
  authentication_token: {
    type: String,
    optional: true,
  },
  last_sign_in_provider: {
    type: String,
    optional: true,
  },
  sign_in_count: {
    type: Number,
    optional: true,
  },
  current_sign_in_at: {
    type: Date,
    optional: true,
  },
  last_sign_in_at: {
    type: Date,
    optional: true,
  },
  current_sign_in_ip: {
    type: String,
    optional: true,
  },
  last_sign_in_ip: {
    type: String,
    optional: true,
  },
});

// Describe collection for store Api Umbrella Users
const ApiUmbrellaUsersSchema = new SimpleSchema({
  id: {
    type: String,
    optional: true,
  },
  api_key: {
    type: String,
    optional: true,
  },
  created_at: {
    type: Date,
    optional: true,
  },
  first_name: {
    type: String,
    optional: true,
  },
  last_name: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
  email_verified: {
    type: Boolean,
    optional: true,
  },
  website: {
    type: String,
    optional: true,
  },
  registration_source: {
    type: String,
    optional: true,
  },
  throttle_by_ip: {
    type: Boolean,
    optional: true,
  },
  disabled_at: {
    type: Date,
    optional: true,
  },
  roles: {
    type: [String],
    optional: true,
  },
  userId: {
    type: String,
    label: 'User',
    optional: true,
    autoform: {
      options () {
        // Get all Meteor users as array
        const users = Meteor.users.find().fetch();
        // Create an array of label value pairs for autoform select
        return _.map(users, (user) => {
          return {
            label: user.emails[0].address,
            value: user._id,
          };
        });
      },
    },
  },
});

ApiUmbrellaAdmins.attachSchema(ApiUmbrellaAdminsSchema);
ApiUmbrellaUsers.attachSchema(ApiUmbrellaUsersSchema);
