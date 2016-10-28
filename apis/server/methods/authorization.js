import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Apis } from '/apis/collection';

Meteor.methods({
  addAuthorizedUserByEmail (apiId, email) {
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
  currentUserCanViewApi (apiBackendId) {
    // Placeholder for 'user is authorized'
    let userAuthorized;

    // Get API
    const api = Apis.findOne(apiBackendId);

    // Check if user can view
    if (apiBackend && api.currentUserCanView()) {
      // User is authorized to view this API
      userAuthorized = true;
    } else {
      // User is NOT authorized to view this API
      userAuthorized = false;
    }

    return userAuthorized;
  },
  currentUserCanEditApi (apiBackendId) {
    // Placeholder for 'user can edit'
    let userCanEdit;

    // Get API
    const api = Apis.findOne(apiBackendId);

    // Check if user can edit
    if (apiBackend && api.currentUserCanEdit()) {
      // User is authorized to view this API
      userCanEdit = true;
    } else {
      // User is NOT authorized to view this API
      userCanEdit = false;
    }

    return userCanEdit;
  },
});
