import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'lodash';

// APINF collection imports
import { Apis } from '/apis/collection';
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

Organizations.helpers({
  apis () {
    // Get list of api ids
    const apiIds = this.managedApiIds();

    // Make sure organization has APIs
    if (apiIds.length > 0) {
      // Get user id
      const userId = Meteor.userId();

      // Placeholder for filtering
      let filtering;

      // Set filters
      // Case: Registered users
      if (userId) {
        // Case: user is admin or manager of organization

        // Get all managed organizations fo current user
        const userIsOrganizationManager = Organizations.find({ managerIds: userId }).count();
        // Check if user is admin
        const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

        if (userIsAdmin || userIsOrganizationManager > 0) {
          // Show all managed apis of current organization
          filtering = { _id: { $in: apiIds } };
        } else {
          // Case: user is manager of APIs or without APIs

          // Select available managed apis of current organization
          filtering = { _id: { $in: apiIds },
            $or: [
              { isPublic: true },
              { managerIds: userId },
              { authorizedUserIds: userId },
            ],
          };
        }
      } else {
        // Case: Anonymous users

        // Show all public managed apis of current organization
        filtering = { _id: { $in: apiIds }, isPublic: true };
      }
      // Return list of APIs
      return Apis.find(filtering).fetch();
    }
    // Return empty array because organization doesn't have APIs
    return [];
  },
  apisCount () {
    // Return a count of Organiztion-API Links
    return OrganizationApis.find({ organizationId: this._id }).count();
  },
  hasPublicApis () {
    // Get array of managed apis which available for current user
    const apis = this.apis();

    // Return true if organization has at least one public api
    return apis.length > 0;
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
  filteredApis (filterQuery) {
    // Get user id
    const userId = Meteor.userId();

    // Get IDs of managed APIs
    const apiIds = this.managedApiIds();

    // Placeholder for filtering
    let filtering;

    // Set filters
    // Case: Registered users
    if (userId) {
      // Case: user is admin or manager of organization

      // Get all managed organizations fo current user
      const userIsOrganizationManager = Organizations.find({ managerIds: userId }).count();
      // Check if user is admin
      const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

      if (userIsAdmin || userIsOrganizationManager > 0) {
        // Show all managed apis of current organization
        filtering = { _id: { $in: apiIds } };
      } else {
        // Case: user is manager of APIs or without APIs

        // Select available managed apis of current organization
        filtering = { _id: { $in: apiIds },
          $or: [
            { isPublic: true },
            { managerIds: userId },
            { authorizedUserIds: userId },
          ],
        };
      }
    } else {
      // Case: Anonymous users

      // Show all public managed apis of current organization
      filtering = { _id: { $in: apiIds }, isPublic: true };
    }

    // Add filter options to database query
    _.forEach(filterQuery, (value, field) => {
      // Add fields from filter to database query
      filtering[field] = value;
    });

    // Get an array of APIs, based on API IDs array and filter
    return Apis.find(filtering).fetch();
  },
});
