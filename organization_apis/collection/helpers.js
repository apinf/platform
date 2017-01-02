import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from './';

Organizations.helpers({
  apis () {
    // Placeholder for API documents
    let apis;

    // Get organizationApis document, which joins organizations with APIs
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });

    // Make sure organization has APIs
    if (organizationApis && organizationApis.apiIds.length() > 0) {
      // Return array of organization apis
      apis = Apis.find({ _id: { $in: organizationApis.apiIds } }).fetch();
    }

    return apis;
  },
  apisCount () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });
    // Return number of organization apis
    return organizationApis.apiIds.length;
  },
});

Apis.helpers({
  organization () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ apiIds: { $in: [this._id] } });

    // Return organization
    return Organizations.findOne({ _id: organizationApis.organizationId });
  },
});
