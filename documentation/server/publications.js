// Collection imports
import DocumentationFiles from '/documentation/collection';

Meteor.publish(
  'singleDocumentationFile', (documentationFileId) => {
    // Make sure documentationFileId
    check(documentationFileId, String);

    // Convert _id value to Object Id instance
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    return DocumentationFiles.find({
      _id: objectId,
      'metadata._Resumable': {
        $exists: false,
      },
    });
  });
