/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ValidEmail } from 'meteor/froatsnook:valid-email';

// Collection imports
import Apis from '/packages/apis/collection';
import Settings from '/packages/settings/collection';

Meteor.methods({
  addAuthorizedUserByEmail (apiId, email) {
    // Make sure apiId is a string
    check(apiId, String);

    // Make sure email is a valid email
    check(email, ValidEmail);

    // Get user with matching email
    const user = Accounts.findUserByEmail(email);

    // Get API document
    const api = Apis.findOne(apiId);

    // Check if user is already authorized
    const userAlreadyAuthorized = api.authorizedUserIds.includes(user._id);

    // Check if the user is already authorized
    if (!userAlreadyAuthorized) {
      // Add user ID to API authorized user IDs field
      Apis.update(apiId, { $push: { authorizedUserIds: user._id } });
    }
  },
  currentUserCanViewApi (slug) {
    // Make sure apiId is a string
    check(slug, String);

    // Get API
    const api = Apis.findOne({ slug });

    // Check if user can view
    return api && api.currentUserCanView();
  },
  currentUserCanEditApi (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API
    const api = Apis.findOne(apiId);

    // Check if user can edit
    return api && api.currentUserCanManage();
  },
  currentUserCanAddApi () {
    // Get current user Id
    const userId = Meteor.userId();

    // Make sure user is logged in
    if (userId === null) {
      // Anonymous user not allowed to add API
      return false;
    }
    // Get Settings (used to check for access permission)
    const settings = Settings.findOne();

    // If the access permission 'only admins can add APIs' is defined, use it
    if (settings && settings.access && settings.access.onlyAdminsCanAddApis) {
      // Make sure current user is admin
      return Roles.userIsInRole(userId, ['admin']);
    }

    // Allow users to add APIs by default
    return true;
  },
});
