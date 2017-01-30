import { _ } from 'lodash';

// APINF collection imports
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
  filteredApis (filterQuery) {
    // Get IDs of managed APIs
    const apiIds = this.managedApiIds();

    // Find in managed APIs
    const dbQuery = { _id: { $in: apiIds } };

    // Add filter options to database query
    _.forEach(filterQuery, (value, field) => {
      // Add fields from filter to database query
      dbQuery[field] = value;
    });

    // Get an array of APIs, based on API IDs array and filter
    return Apis.find(dbQuery).fetch();
  },
});
