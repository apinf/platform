// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';
import { ValidEmail } from 'meteor/froatsnook:valid-email';

// Collection imports
import Apis from '/apis/collection';

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
  currentUserCanViewApi (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API
    const api = Apis.findOne(apiId);

    // Check if user can view
    return api && api.currentUserCanView();
  },
  currentUserCanEditApi (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API
    const api = Apis.findOne(apiId);

    // Check if user can edit
    return api && api.currentUserCanEdit();
  },
});
