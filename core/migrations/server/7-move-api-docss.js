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
      if (api.documentationFileId) {
        // New apiDoc object
        const apiDoc = {
          apiId: api._id,
          fileId: api.documentationFileId,
          type: 'file',
          submit_methods: api.submit_methods,
        };

        // Insert migrated API docs
        ApiDocs.insert(apiDoc);
      }
      if (api.documentation_link) {
        const apiDoc = {
          apiId: api._id,
          type: 'url',
          otherUrl: api.documentation_link,
        };
        ApiDocs.insert(apiDoc);
      }
    });
  },
});
