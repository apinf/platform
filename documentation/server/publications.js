import { DocumentationFiles } from '/documentation/collection/collection';

Meteor.publish(
  'singleDocumentationFile', function(documentationFileId) {

    // Convert _id value to Object Id instance
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    return DocumentationFiles.find({
      _id: objectId,
      'metadata._Resumable': {
        $exists: false
      }
    });
});
