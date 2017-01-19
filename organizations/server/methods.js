// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

// APINF collections import
import { Apis } from '/apis/collection';
import { OrganizationApis } from '/organization_apis/collection';

Meteor.methods({
  getUnlinkedApis () {
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

      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
      // Is user no admin then
      if (!userIsAdmin) {
        // Limit selection for current user
        queryParams.managerIds = userId;
      }

      // Return cursor on unlinked apis
      return Apis.find(queryParams).fetch();
    }

    // Return empty result for anonymous user
    return [];
  },
});
