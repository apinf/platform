/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

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
    OrganizationApis.find().forEach((organizationApis) => {
      // Get API ID
      const apiId = organizationApis.apiId;
      // Get Organization ID
      const organizationId = organizationApis.organizationId;
      // Get API metadata document
      const apiMetadata = ApiMetadata.findOne({ apiId });

      // Make sure API metadata document exists
      if (apiMetadata) {
        // Then update document
        ApiMetadata.update(apiMetadata._id, { $set: { organizationId } });
      } else {
        // Otherwise create a new one
        ApiMetadata.insert({ apiId, organizationId });
      }
    });
  },
});
