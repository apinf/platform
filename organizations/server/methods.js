// Meteor packages import
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';

// APINF collections import
import { Apis } from '/apis/collection';
import { OrganizationApis } from '/organization_apis/collection';

Meteor.methods({
  getUnlinkedApis (organizationId) {
    // Check arguments
    check(organizationId, String);

    const userId = this.userId;

    // Find result for user with role
    if (userId) {
      // Find & group all booked apis
      const organizationApisLink = OrganizationApis.find().fetch();

      const linkedApis = _.map(organizationApisLink, (module) => {
        return module.apiId;
      });

      // Find apis that no equal booked
      const queryParams = {
        _id: { $nin: linkedApis },
      };

      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
      // Is user no admin then
      if (!userIsAdmin) {
        // limit selection by belong to current user
        queryParams.managerIds = userId;
      }

      // Return cursor on no booked apis
      return Apis.find(queryParams).fetch();
    }

    // Return empty result
    return [];
  },
});
