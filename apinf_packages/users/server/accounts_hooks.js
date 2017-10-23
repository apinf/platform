/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  // Create empty user profile if none exists
  user.profile = user.profile || {};

  // Check services object exists
  if (user.services) {

    // Get the service, can be 'github', 'fiware' or 'password'
    const service =  _.keys(user.services)[0];

    // password: Register with local account, email verification required
    if (services === 'password') {
      // we wait for Meteor to create the user before sending an email
      Meteor.setTimeout(() => {
        Meteor.call('sendRegistrationEmailVerification', user._id);
      }, 2 * 1000);
    } else {

      // Set user email address from Github/Fiware email
      user.emails = [
        {
          address: user.services[service].email,
          verified: true,
        },
      ];

      // Search 'username' from database.
      const username = user.services[service].username;
      const existingUser = Meteor.users.findOne({ username });

      if (existingUser === undefined) {
        user.username = username;
      } else {
        // Username clashes with existing username
        user.username = `gh-${username}`;

        // Case 1: it's the same username and same email

        // Case 2: it's a different email, add prefix
        if (service === 'github') {
        user.username = `gh-${username}`;
      }

    }
  }

  return user;
});
