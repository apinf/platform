import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';
import ApiDocs from '/api_docs/collection';

Migrations.add({
  version: 7,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((api) => {
      // Iterate through ApiDocs collection
      ApiDocs.find().forEach((apiDoc) => {
        // Check if fields exist
        if (api.documentationFileId === apiDoc.fileId) {
          // perform update operation
          ApiDocs.update(apiDoc._id, {
            $set: { type: 'file' },
          });
        }
      });
    });
  },
});
