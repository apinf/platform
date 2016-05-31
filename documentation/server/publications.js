import { documentationFiles } from '/documentation/collection/collection';

Meteor.publish(
  'allDocumentationFiles', function() {
    return documentationFiles.find({
      'metadata._Resumable': {
        $exists: false
      }
    });
});
