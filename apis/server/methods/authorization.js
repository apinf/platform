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
});
