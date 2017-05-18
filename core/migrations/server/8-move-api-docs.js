import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';
import ApiDocs from '/api_docs/collection';

Migrations.add({
  version: 8,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((api) => {
      // Search for ApiDoc which matches with api documentation file ID
      if (ApiDocs.findOne({ fileId: api.documentationFileId })) {
        // change type to file, if match was found
        ApiDocs.update({ apiId: api._id },
          { $set:
            { type: 'file' },
          });
      }
    });
  },
});
