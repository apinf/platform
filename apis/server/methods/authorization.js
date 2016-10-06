import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Apis } from '/apis/collection';

Meteor.methods({
  addAuthorizedUserByEmail (apiId, email) {
    // Get user with matching email
    const user = Accounts.findUserByEmail(email);

    // TODO: check whether user is already in list before adding

    // Add user ID to API authorized user IDs field
    Apis.update(apiId, { $push: { authorizedUserIds: user._id } });
  },
});
