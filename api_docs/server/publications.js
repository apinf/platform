import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import DocumentationFiles from '/api_docs/files/collection';

Meteor.publish(
  'singleDocumentationFile', (fileId) => {
    // Make sure documentationFileId
    check(fileId, String);

    // Convert _id value to Object Id instance
    const objectId = new Mongo.Collection.ObjectID(fileId);

    return DocumentationFiles.find({
      _id: objectId,
      'metadata._Resumable': {
        $exists: false,
      },
    });
  });
