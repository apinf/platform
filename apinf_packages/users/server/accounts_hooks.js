/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

import LoginPlatforms from '/apinf_packages/login_platforms/collection';

// OAuth Services dictionary to get the correct prefix
const servicePrefixDictionary = {
  fiware: 'fw',
  github: 'gh',
};

// Get login Platform data from DB
const loginPlatformsData = LoginPlatforms.findOne();

// Get check Login Platform data is available or not
if (loginPlatformsData) {
  // get githubConfiguration from DB
  const githubConfiguration = loginPlatformsData.githubConfiguration;
  // check githubConfiguration is available or not.
  if (githubConfiguration) {
    // check clientId and secret are available or not for githubConfiguration
    if (githubConfiguration.clientId && githubConfiguration.secret) {
      ServiceConfiguration.configurations.upsert(
        { service: 'github' },
        {
          $set: {
            loginStyle: 'popup',
            clientId: githubConfiguration.clientId,
            secret: githubConfiguration.secret,
          },
        }
      );
    }
  }

  // get fiwareConfiguration from DB
  const fiwareConfiguration = loginPlatformsData.fiwareConfiguration;

  // check fiwareConfiguration is available or not.
  if (fiwareConfiguration) {
    // check clientId, rootURL and secret are available or not for fiwareConfiguration
    if (fiwareConfiguration.clientId && fiwareConfiguration.rootURL && fiwareConfiguration.secret) {
      ServiceConfiguration.configurations.upsert(
        { service: 'fiware' },
        {
          $set: {
            clientId: loginPlatformsData.fiwareConfiguration.clientId,
            rootURL: loginPlatformsData.fiwareConfiguration.rootURL,
            secret: loginPlatformsData.fiwareConfiguration.secret,
          },
        }
      );
    }
  }
}

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

Accounts.emailTemplates.siteName = 'APInf';
Accounts.emailTemplates.from = 'apinf.nightly@apinf.io';

Accounts.emailTemplates.enrollAccount.subject = function () {
  return 'Verify Your Email Address';
};

Accounts.emailTemplates.enrollAccount.text = function (user, link) {
  return `To verify your email address visit the following link: \n \n ${link}`;
};
