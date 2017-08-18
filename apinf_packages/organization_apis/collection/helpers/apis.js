/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Organizations from '/apinf_packages/organizations/collection';
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
