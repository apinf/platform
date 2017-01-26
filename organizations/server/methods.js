// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidEmail } from 'meteor/froatsnook:valid-email';
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
    // Make sure manager (with organizationId and email) is an Object
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

      if (!alreadyManager) {
        // Add user ID to manager IDs field
        Organizations.update(manager.organizationId, { $push: { managerIds: user._id } });

        // Make organization manager a manager of APIs
        Meteor.call('makeOrganizationManagerApiManager', manager.organizationId, manager.email);
      } else {
        throw new Meteor.Error('manager-already-exist');
      }
    } else {
      throw new Meteor.Error('email-not-registered');
    }
  },
  makeOrganizationManagerApiManager (organizationId, email) {
    // Make sure organizationId is an String
    check(organizationId, String);

    // Make sure email is a valid email
    check(email, ValidEmail);

    // Get user with matching email
    const user = Accounts.findUserByEmail(email);

    // Get APIs managed by organization
    const organizationApis = Organizations.findOne(organizationId).managedApiIds();

    if (organizationApis) {
      organizationApis.forEach((apiId) => {
        // Get API document
        const api = Apis.findOne(apiId);

        // Check if user is already manager
        const alreadyManager = api.managerIds.includes(user._id);

        if (!alreadyManager) {
          // Add user ID to API manager IDs field
          Apis.update(apiId, { $push: { managerIds: user._id } });
        }
      });
    }
  },
});
