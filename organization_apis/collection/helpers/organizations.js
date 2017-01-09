import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from '../';

Organizations.helpers({
  apis () {
    // Placeholder for API documents
    let apis;

    // Get organizationApis document, which joins organizations with APIs
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });

    // Make sure organization has APIs
    if (organizationApis && organizationApis.apiIds.length > 0) {
      // Get an array of organization APIs
      apis = Apis.find({ _id: { $in: organizationApis.apiIds } }).fetch();
    }

    return apis;
  },
  apisCount () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });
    // Return number of organization apis
    return organizationApis ? organizationApis.apiIds.length : 0;
  },
});
