/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';

import LoginPlatforms from '/apinf_packages/login_platforms/collection';

// OAuth Services dictionary to get the correct prefix
const servicePrefixDictionary = {
  fiware: 'fw',
  github: 'gh',
};


/*const LoginPlatform = LoginPlatforms.findOne();

console.log(LoginPlatform)
ServiceConfiguration.configurations.upsert(
  { service: 'github' },
  {
    $set: {
      loginStyle: "popup",
      clientId: LoginPlatform.githubConfiguration.clientId,
      secret: LoginPlatform.githubConfiguration.secret
    }
  }
);*/

Accounts.onCreateUser((options, user) => {
  // Create empty user profile if none exists
  user.profile = user.profile || {};

  // Check services object exists
  if (user.services) {
    // Get the service, can be 'github', 'fiware' or 'password'
    const service = Object.keys(user.services)[0];

    // password: Register with local account, email verification required
    if (service === 'password') {
      // we wait for Meteor to create the user before sending an email
      Meteor.setTimeout(() => {
        Meteor.call('sendRegistrationEmailVerification', user._id);
      }, 2 * 1000);
    } else {
      // Define current service username to variable
      const username = user.services[service].username;

      // Search 'username' from database.
      const existingUser = Meteor.users.findOne({ username });

      // Define email object for current register action
      const currentRegisteringEmail = {
        address: user.services[service].email,
        verified: true,
      };

      if (existingUser === undefined) {
        // Set service username to username
        user.username = username;

        // Set service email to user email
        user.emails = [
          currentRegisteringEmail,
        ];
      } else {
        // Get username prefix based on service being used
        const prefix = servicePrefixDictionary[service] || 'oauth';

        // Username clashes with existing username
        user.username = `${prefix}-${username}`;

        // Append service email to user emails
        user.emails = [
          ...existingUser.emails,
          currentRegisteringEmail,
        ];
      }
    }
  }

  return user;
});
