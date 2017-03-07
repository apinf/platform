import { Migrations } from 'meteor/percolate:migrations';

import ApiMetadata from '/metadata/collection';
import OrganizationApis from '/organization_apis/collection';

Migrations.add({
  version: 4,
  name: 'Adds linking between API Metadata document and related Organization document',
  up () {
    // Code to migrate up to version 4

    // Migrate to use 'apiId' instead of 'apiBackendId'
    ApiMetadata.find().forEach((apiMetadata) => {
      // Create apiId field and get the value
      ApiMetadata.update(apiMetadata._id, { $set: { apiId: apiMetadata.apiBackendId } });
    });


    // Linking between apiMetadata and Organization collections
    // TODO: revert. SHould loop by organizationApis
    // Get all apiMetadata without organization data
    ApiMetadata.find().forEach((apiMetadata) => {
      // Get the related organization
      const organizationApis = OrganizationApis.findOne({ apiId: apiMetadata.apiId });

      // Make sure API is connected to organization
      if (organizationApis) {
        // Add link to the related organization document
        ApiMetadata.update(apiMetadata._id, {
          $set: { organizationId: organizationApis.organizationId },
        });
      }
    });
  },
});
