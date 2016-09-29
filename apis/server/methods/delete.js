// Meteor imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Collection imports
import { Apis } from '/apis/collection';
import { ApiBacklogItems } from '/backlog/collection';
import { ApiMetadata } from '/metadata/collection';
import { DocumentationFiles } from '/documentation/collection/collection';
import { Feedback } from '/feedback/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Meteor.methods({
  // Remove API backend and related items
  removeApi (apiId) {
    // Remove API doc
    Meteor.call('removeApiDoc', apiId);

    // Remove backlog items
    ApiBacklogItems.remove({ apiId });

    // Remove feedbacks
    Feedback.remove({ apiId });

    // Remove metadata
    ApiMetadata.remove({ apiId });

    // Get proxyBackend
    const proxyBackend = ProxyBackends.findOne({ apiId });

    // Check if API has proxyBackend
    if (proxyBackend) {
      // Delete proxyBackend
      Meteor.call('deleteProxyBackend', proxyBackend);
    }

    // Finally remove the API
    Apis.remove(apiId);
  },
  // Remove API documentation file
  removeApiDoc (apiId) {
    // Get API object
    const api = Apis.findOne(apiId);
    // Get documentationFileId
    const documentationFileId = api.documentationFileId;
    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);
    // Remove documentation object
    DocumentationFiles.remove(objectId);
  },
});
