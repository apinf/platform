// Collection imports
import Apis from '/apis/collection';
import Organizations from '/organizations/collection';
import OrganizationApis from '../';

Apis.helpers({
  organization () {
    // Placeholder for organization document
    let organization;

    // Get single organizationApis document (link between API and Organization)
    const organizationApiLink = OrganizationApis.findOne({ apiId: this._id });

    if (organizationApiLink) {
      // Get reference to organization ID
      const organizationId = organizationApiLink.organizationId;

      // Fetch organization
      organization = Organizations.findOne({ _id: organizationId });
    }

    // Return organization
    return organization;
  },
});
