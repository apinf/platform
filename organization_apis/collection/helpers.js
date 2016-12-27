import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from './';

Organizations.helpers({
  apis () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });

    // Return array of organization apis
    return Apis.find({ _id: { $in: organizationApis.apiIds } }).fetch();
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
