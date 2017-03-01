import { Migrations } from 'meteor/percolate:migrations';

import Apis from '/apis/collection';
import ApiDocs from '/api_docs/collection';

Migrations.add({
  version: 3,
  name: 'Move API documentation from Apis to ApiDocs collection',
  up () {
    // Iterate through Apis collection
    Apis.find().forEach((apis) => {
      // New apiDoc object
      const apiDoc = {
        apiId: apis._id,
        fileId: apis.documentationFileId,
        otherUrl: apis.documentation_link,
        submit_methods: apis.submit_methods,
      };

      // Insert migrated API docs
      ApiDocs.insert(apiDoc);
    });
  },
});
