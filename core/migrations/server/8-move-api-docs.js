import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';
import ApiDocs from '/api_docs/collection';

Migrations.add({
  version: 8,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((api) => {
      // Iterate through ApiDocs collection
      if (ApiDocs.findOne({ fileId: api.documentationFileId })) {
          // perform update operation
        ApiDocs.update({ apiId: api._id },
          { $set:
            { type: 'file' },
          });
      }
    });
  },
});
