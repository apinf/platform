import { Migrations } from 'meteor/percolate:migrations';

import ApiMetadata from '/metadata/collection';
import OrganizationApis from '/organization_apis/collection';

Migrations.add({
  version: 4,
  name: 'Adds linking between API Metadata document and related Organization document',
  up () {
    // Code to migrate up to version 4

    // Iterate through apiMetadata collection
    // Get all exists
    ApiMetadata.find({ organization: { $exists: true } }).forEach((apiMetadata) => {
      // Get the related organization
      const organizationApis = OrganizationApis.findOne({ apiId: apiMetadata.apiBackendId });

      // Make sure API is connected to organization
      if (organizationApis) {
        // Add link to the related organization document
        ApiMetadata.update(apiMetadata._id, { $set: { organizationId: organizationApis.organizationId }});
      }
    });
  },
  down () {
    // Delete organisationId field
    ApiMetadata.update({}, { $unset: { organizationId: '' } }, { multi: true });
  },
});
