import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
import { _ } from 'lodash';
import OrganizationApis from '../';

Organizations.helpers({
  apis () {
    // Placeholder for API documents
    let apis;

    // Get organizationApis document, which joins organizations with APIs
    const organizationApiLinks = OrganizationApis.find({ organizationId: this._id }).fetch();

    // Make sure organization has APIs
    if (organizationApiLinks) {
      //   Get an array of API IDs
      const apiIds = _.map(organizationApiLinks, (organizationApiLink) => {
        // Return API ID for current organizaiton-api link
        return organizationApiLink.apiId;
      });

      // Get an array of APIs, based on API IDs array
      apis = Apis.find({ _id: { $in: apiIds } }).fetch();
    }

    return apis;
  },
  apisCount () {
    // Return a count of Organiztion-API Links
    return OrganizationApis.find({ organizationId: this._id }).count();
  },
});
