/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Migrations } from 'meteor/percolate:migrations';

import ApiMetadata from '/imports/metadata/collection';

Migrations.add({
  version: 4,
  name: 'Uses apiId field instead of apiBackendId',
  up () {
    // Migrate to use 'apiId' instead of 'apiBackendId' for documents with apiBackendId
    ApiMetadata.find({ apiBackendId: { $exists: true } }).forEach((apiMetadata) => {
      // Create apiId field and get the value
      ApiMetadata.update(apiMetadata._id, { $set: { apiId: apiMetadata.apiBackendId } });
    });
  },
});
