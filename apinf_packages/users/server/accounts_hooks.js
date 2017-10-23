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
    // Case 1: Register with Github
    if (user.services.github) {
      // Set user email address from Github email
      user.emails = [
        {
          address: user.services.github.email,
          verified: true,
        },
      ];
      // Search 'githubUsername' from database.
      const githubUsername = user.services.github.username;
      const existingUser = Meteor.users.findOne({ username: githubUsername });
      if (existingUser === undefined) {
        // Username available, set username to Github username.
        user.username = githubUsername;
      } else {
        // Username clashes with existing username, add prefix
        user.username = `gh-${githubUsername}`;
      }
      console.log('Registered via github');
    // Case 2: Register with Fiware
    } else if (user.services.fiware) {
      // Set user email address from FIWARE email
      user.emails = [
        {
          address: user.services.fiware.email,
          verified: true,
        },
      ];
      // Search 'fiwareUsername' from database.
      const fiwareUsername = user.services.github.username;
      const existingUser = Meteor.users.findOne({ username: fiwareUsername });
      if (existingUser === undefined) {
        // Username available, set username to FIWARE username.
        user.username = fiwareUsername;
      } else {
        // Username clashes with existing username, add prefix
        user.username = `gh-${fiwareUsername}`;
      }
      console.log('Registered via fiware');
    // Case 3: Register with local account, email verification required
    } else if (user.services.password) {
      // we wait for Meteor to create the user before sending an email
      Meteor.setTimeout(() => {
        Meteor.call('sendRegistrationEmailVerification', user._id);
      }, 2 * 1000);
    }
  }

  return user;
});
