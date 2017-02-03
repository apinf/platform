import { Meteor } from 'meteor/meteor';
import { _ } from 'lodash';

import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

Organizations.helpers({
  apis () {
    // Get list of api ids
    const apiIds = this.managedApiIds();

    // Make sure organization has APIs
    if (apiIds.length > 0) {
      // Return list of APIs
      return Apis.find({ _id: { $in: apiIds } }).fetch();
    }
    // Return empty array because organization doesn't have APIs
    return [];
  },
  apisCount () {
    // Return a count of Organiztion-API Links
    return OrganizationApis.find({ organizationId: this._id }).count();
  },
  managedApiIds () {
    // Get organizationApis document, which joins organizations with APIs
    const organizationApiLinks = OrganizationApis.find({ organizationId: this._id }).fetch();

    // Make sure organization has APIs
    if (organizationApiLinks) {
      //   Get an array of API IDs
      return _.map(organizationApiLinks, (organizationApiLink) => {
        // Return API ID for current organizaiton-api link
        return organizationApiLink.apiId;
      });
    }
    // Return empty array because organization doesn't have APIs
    return [];
  },
  userVisibleApisQuery (managedApiIds) {
    let apiIds;

    // Get list of managed apis for current organization
    // Check if function parameter exists
    if (managedApiIds) {
      // Get list from function parameter
      apiIds = managedApiIds;
    } else {
      // Get list from collection helper
      apiIds = this.managedApiIds();
    }

    // Placeholder for storage database query
    let filteredApis;

    const userId = Meteor.userId();

    // Case: Registered users
    if (userId) {
      // Case: user is manager of APIs or without APIs
      // Select available organization apis for current user
      filteredApis = {
        _id: { $in: apiIds },
        $or: [
          { isPublic: true },
          { managerIds: userId },
          { authorizedUserIds: userId },
        ],
      };
    } else {
      // Case: Anonymous users

      // Show all public apis of organization
      filteredApis = { _id: { $in: apiIds }, isPublic: true };
    }

    return filteredApis;
  },
  userVisibleApisCursor (managedApiIds, currentUser) {
    let apiIds;
    let userId;

    // Get list of managed apis for current organization
    // Check if function parameter exists
    if (managedApiIds) {
      // Get list from function parameter
      apiIds = managedApiIds;
    } else {
      // Get list from collection helper
      apiIds = this.managedApiIds();
    }

    // Get list of managed apis for current organization
    // Check if function parameter exists
    if (currentUser) {
      // Get list from function parameter
      userId = currentUser;
    } else {
      // Get list from collection helper
      userId = Meteor.userId();
    }

    // Placeholder for storage database query
    let filteredApis;

    // Case: Registered users
    if (userId) {
      // Case: user is manager of APIs or without APIs
      // Select available organization apis for current user
      filteredApis = {
        _id: { $in: apiIds },
        $or: [
          { isPublic: true },
          { managerIds: userId },
          { authorizedUserIds: userId },
        ],
      };
    } else {
      // Case: Anonymous users

      // Show all public apis of organization
      filteredApis = { _id: { $in: apiIds }, isPublic: true };
    }

    // Return cursor on organization apis which can be shown for current user
    return Apis.find(filteredApis);
  },
});
