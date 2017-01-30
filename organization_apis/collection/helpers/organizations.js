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
  hasPublicApis () {
    // Get array of managed apis which available for current user
    const apis = Apis.find().fetch();

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
});
