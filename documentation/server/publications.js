import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import DocumentationFiles from '/documentation/collection';

Meteor.publish(
  'singleDocumentationFile', (documentationFileId) => {
    // Convert _id value to Object Id instance
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    return DocumentationFiles.find({
      _id: objectId,
      'metadata._Resumable': {
        $exists: false,
      },
    });
  });
