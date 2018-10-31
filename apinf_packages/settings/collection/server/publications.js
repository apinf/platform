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
import Settings from '../';

Meteor.publish('settings', function () {
  // Only Administrator can access all settings
  const userIsAdministrator = Roles.userIsInRole(this.userId, 'admin');

  // Placeholder for settings, if user is authorized
  let settingsCursor;

  if (userIsAdministrator) {
    // User is authorized
    settingsCursor = Settings.find();
  } else {
    // User is not authorized
    settingsCursor = [];
  }
  return settingsCursor;
});

Meteor.publish('singleSetting', (setting) => {
  // Make sure setting is a String
  check(setting, String);

  // TODO: Determine if/how to check whether user is authorized to view setting

  // Set up a query settings object containing fields and a result limit
  const querySettings = { fields: {}, limit: 1 };

  // Specify the setting field we want to retrieve (passed in as argument)
  querySettings.fields[setting] = 1;

  // Return a cursor containing only the requested setting from the Settings document
  return Settings.find({}, querySettings);
});
