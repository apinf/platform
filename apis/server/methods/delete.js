import { DocumentationFiles } from '/documentation/collection/collection';

Meteor.methods({
  "removeApiBackend": function(apiBackendId) {
    // Remove API doc
    removeApiDoc(apiBackendId);
    // Remove backlog items
    ApiBacklogItems.remove({"apiBackendId": apiBackendId});
    // Remove feedbacks
    Feedback.remove({"apiBackendId": apiBackendId});
    // Remove metadata
    ApiMetadata.remove({"apiBackendId": apiBackendId});
    // Finally remove the API
    ApiBackends.remove(apiBackendId);
  }
});

// Helper to remove API documentation file
function removeApiDoc(apiBackendId) {
  // Get API object
  const api = ApiBackends.findOne(apiBackendId);
  // Get documentationFileId
  const documentationFileId = api.documentationFileId;
  // Convert to Mongo ObjectID
  const objectId = new Mongo.Collection.ObjectID(documentationFileId);
  // Remove documentation object
  DocumentationFiles.remove(objectId);
}
