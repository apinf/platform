// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';

// APINF collections import
import { Apis } from '/apis/collection';
import OrganizationApis from '/organization_apis/collection';
import Organizations from '/organizations/collection';

import _ from 'lodash';

Meteor.methods({
  getCurrentUserUnlinkedApis () {
    // Get current User ID
    const userId = this.userId;

    // Find result for user with role
    if (userId) {
      // Find & group all connected apis
      const organizationApis = OrganizationApis.find().fetch();

      const linkedApis = _.map(organizationApis, (document) => {
        return document.apiId;
      });

      // Find apis that no equal connected
      const queryParams = {
        _id: { $nin: linkedApis },
      };

      // Check if user has admin role
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      // Is user not admin then
      if (!userIsAdmin) {
        // Limit selection for current user
        queryParams.managerIds = userId;
      }

      // Return cursor on unlinked apis
      return Apis.find(queryParams).fetch();
    }

    // Return undefined result for anonymous user
    return undefined;
  },
  addOrganizationManagerByEmail (manager) {
    // Make sure organizationId is a string
    check(manager, Object);

    // Check if email is registered
    const emailIsRegistered = Meteor.call('checkIfEmailIsRegistered', manager.email);

    if (emailIsRegistered) {
      // Get user with matching email
      const user = Accounts.findUserByEmail(manager.email);

      // Get organization document
      const organization = Organizations.findOne(manager.organizationId);

      // Check if user is already a manager
      const alreadyManager = organization.managerIds.includes(user._id);

      // Check if the user is already a manager
      if (!alreadyManager) {
        // Add user ID to manager IDs field
        Organizations.update(manager.organizationId, { $push: { managerIds: user._id } });
      } else {
        throw new Meteor.Error('manager-already-exist');
      }
    } else {
      throw new Meteor.Error('email-not-registered');
    }
  },
});
