// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

// APINF collections import
import { Apis } from '/apis/collection';
import OrganizationApis from '/organization_apis/collection';

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

    // Return empty result for anonymous user
    return [];
  },
});
