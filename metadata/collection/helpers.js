import ApiMetadata from '/metadata/collection';
import OrganizationApis from '/organization_apis/collection';
import Organization from '/organizations/collection';

ApiMetadata.helpers({
  organizationData () {
    // Get link between current API and connected organization
    const organizationApis = OrganizationApis.findOne({ apiId: this.apiId });

    // Make sure link exists
    if (organizationApis) {
      // Return data of related organization
      return Organization.findOne(organizationApis.organizationId);
    }

    return undefined;
  },
});
