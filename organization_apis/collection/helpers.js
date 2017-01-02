import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection';
import { OrganizationApis } from './';

Organizations.helpers({
  apis () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });

    // Return array of organization apis
    return organizationApis ? Apis.find({ _id: { $in: organizationApis.apiIds } }).fetch() : [];
  },
  apisCount () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ organizationId: this._id });
    // Return number of organization apis
    return organizationApis ? organizationApis.apiIds.length : 0;
  },
});

Apis.helpers({
  organization () {
    // Get organizationApis document
    const organizationApis = OrganizationApis.findOne({ apiIds: { $in: [this._id] } });

    // Return organization
    return organizationApis ? Organizations.findOne({ _id: organizationApis.organizationId }) : false;
  },
});
