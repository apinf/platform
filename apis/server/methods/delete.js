// Collection imports
import { Apis } from '/apis/collection';
import { ApiBacklogItems } from '/backlog/collection';
import { ApiMetadata } from '/metadata/collection';
import { DocumentationFiles } from '/documentation/collection/collection';
import { Feedback } from '/feedback/collection';
import { Monitoring } from '/monitoring/collection';

Meteor.methods({
  // Remove API backend and related items
  removeApiBackend (apiBackendId) {
    // Remove API doc
    Meteor.call('removeApiDoc', apiBackendId);

    // Stop the api monitoring if it's enabled
    Meteor.call('stopCron', apiBackendId);

    // Remove backlog items
    ApiBacklogItems.remove({ 'apiBackendId': apiBackendId });

    // Remove feedbacks
    Feedback.remove({ 'apiBackendId': apiBackendId });

    // Remove metadata
    ApiMetadata.remove({ 'apiBackendId': apiBackendId });

    // Remove monitoring settings
    Monitoring.remove({ 'apiId': apiBackendId });

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
