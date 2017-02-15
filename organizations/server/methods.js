// Meteor packages imports
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apis/collection';
import OrganizationApis from '/organization_apis/collection';
import Organizations from '/organizations/collection';

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

      // Return sorted list of unlinked apis by name
      return Apis.find(queryParams, { sort: { name: 1 } }).fetch();
    }

    // Return undefined result for anonymous user
    return undefined;
  },
  addOrganizationManagerByEmail (manager) {
    // Make sure manager (with organizationId and email) is an Object
    check(manager, Object);

    // Subsequent checks for the expected object properties
    check(manager.organizationId, String);
    check(manager.email, String);

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
      if (alreadyManager) {
        throw new Meteor.Error('manager-already-exist');
      } else {
        // Add user ID to manager IDs field
        Organizations.update(manager.organizationId, { $push: { managerIds: user._id } });
      }
    } else {
      throw new Meteor.Error('email-not-registered');
    }
  },
  removeOrganizationManager (organizationId, userId) {
    // Make sure organizationId is an String
    check(organizationId, String);

    // Make sure userId is an String
    check(userId, String);

    // Remove User ID from managers array
    Organizations.update({ _id: organizationId },
      { $pull:
         { managerIds: userId },
      }
     );
  },
  removeOrganization (organizationId) {
    check(organizationId, String);
    // Remove organization document
    Organizations.remove(organizationId);

    // Get all organizationApis links with current organization ID
    const organizationApis = OrganizationApis.find({ organizationId }).fetch();

    // Get array with all IDs of found document
    const organizationApisIDs = _.map(organizationApis, (link) => {
      return link._id;
    });

    // Remove organizationApi links
    OrganizationApis.remove({ _id: { $in: organizationApisIDs } });
  },
});
