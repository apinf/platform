import { DocumentationFiles } from '/documentation/collection/collection';
import { Apis } from '/apis/collection';
import { ApiMetadata } from '/metadata/collection';

Meteor.methods({
  // Remove API backend and related items
  removeApiBackend (apiBackendId) {
    // Remove API doc
    Meteor.call('removeApiDoc', apiBackendId);

    // Remove backlog items
    ApiBacklogItems.remove({ 'apiBackendId': apiBackendId });

    // Remove feedbacks
    Feedback.remove({ 'apiBackendId': apiBackendId });

    // Remove metadata
    ApiMetadata.remove({ 'apiBackendId': apiBackendId });

    // Finally remove the API
    Apis.remove(apiBackendId);
  },
  // Remove API documentation file
  removeApiDoc (apiBackendId) {
    // Get API object
    const api = Apis.findOne(apiBackendId);
    // Get documentationFileId
    const documentationFileId = api.documentationFileId;
    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);
    // Remove documentation object
    DocumentationFiles.remove(objectId);
  },
});
