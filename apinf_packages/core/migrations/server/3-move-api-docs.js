/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apinf_packages/apis/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

Migrations.add({
  version: 3,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((api) => {
      // Check if fields exist
      if (api.documentationFileId || api.documentation_link) {
        // New apiDoc object
        const apiDoc = {
          apiId: api._id,
          fileId: api.documentationFileId,
          otherUrl: api.documentation_link,
          submit_methods: api.submit_methods,
        };

        // Insert migrated API docs
        ApiDocs.insert(apiDoc);
      }
    });
  },
});
