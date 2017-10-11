/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import LoginPlatforms from '../';

Meteor.publish('loginPlatforms', function () {
  // Only Administrator can access all settings
  const userIsAdministrator = Roles.userIsInRole(this.userId, 'admin');

  // Placeholder for settings, if user is authorized
  let loginPlatformsCursor;

  if (userIsAdministrator) {
    // User is authorized
    loginPlatformsCursor = LoginPlatforms.find();
  } else {
    // User is not authorized
    loginPlatformsCursor = [];
  }
  return loginPlatformsCursor;
});

Meteor.publish('singleLoginPlatform', (loginPlatform) => {
  // Make sure loginPlatform is a String
  check(loginPlatform, String);

  // TODO: Determine if/how to check whether user is authorized to view loginPlatform

  // Set up a query loginPlatforms object containing fields and a result limit
  const querySettings = { fields: {}, limit: 1 };

  // Specify the loginPlatform field we want to retrieve (passed in as argument)
  querySettings.fields[loginPlatform] = 1;

  // Return a cursor containing only the requested loginPlatform from the LoginPlatforms document
  const cursor = LoginPlatforms.find({}, querySettings);

  return cursor;
});
