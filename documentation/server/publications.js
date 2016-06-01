import { DocumentationFiles } from '/documentation/collection/collection';

Meteor.publish(
  'allDocumentationFiles', function() {
    return DocumentationFiles.find({
      'metadata._Resumable': {
        $exists: false
      }
    });
});
