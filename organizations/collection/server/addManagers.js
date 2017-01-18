import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Organizations } from '/organizations/collection';

Meteor.methods({
  addOrganizationManagerByEmail (organizationId, email) {
    // Get user with matching email
    const user = Accounts.findUserByEmail(email);

    // Get organization document
    const organization = Organizations.findOne(organizationId);

    // Check if user is already a manager
    const alreadyManager = organization.managerIds.includes(user._id);

    // Check if the user is already a manager
    if (!alreadyManager) {
      // Add user ID to manager IDs field
      Organizations.update(organizationId, { $push: { managerIds: user._id } });
    }
  },
});
