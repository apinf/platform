import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';
import ApiDocs from '/api_docs/collection';

Migrations.add({
  version: 7,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((api) => {
      // Check if fields exist
      if (api.documentationFileId || api.documentation_link) {
        // New apiDoc object
        const apiDoc = {
          apiId: api._id,
          type: 'file',
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
