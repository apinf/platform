import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { ValidEmail } from 'meteor/froatsnook:valid-email';

import Organizations from '../';

Meteor.methods({
  addOrganizationManagerByEmail (organizationId, email) {
    // Make sure organizationId is a string
    check(organizationId, String);

    // Make sure email is a valid email
    check(email, ValidEmail);

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
