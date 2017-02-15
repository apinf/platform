// Collection imports
import ApiBacklogItems from '/backlog/collection';
import ApiMetadata from '/metadata/collection';
import Apis from '/apis/collection';
import DocumentationFiles from '/documentation/collection';
import Feedback from '/feedback/collection';
import OrganizationApis from '/organization_apis/collection';
import ProxyBackends from '/proxy_backends/collection';
import { MonitoringSettings, MonitoringData } from '/monitoring/collection';

Meteor.methods({
  // Remove API backend and related items
  removeApi (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Remove API doc
    Meteor.call('removeApiDoc', apiId);

    // Stop the api monitoring if it's enabled
    Meteor.call('stopCron', apiId);

    // Get monitoring Settings
    const monitoring = MonitoringSettings.findOne({ apiId });

    // Check if API has monitoring
    if (monitoring) {
      // Remove Monitoring Settings and Monitoring Data
      Meteor.call('removeMonitoring', apiId);
    }

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

    // Remove linked document between APIs and connected organization
    Meteor.call('removeOrganizationApiLink', apiId);

    // Finally remove the API
    Apis.remove(apiId);
  },
  // Remove API documentation file
  removeApiDoc (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API object
    const api = Apis.findOne(apiId);

    // Get documentationFileId
    const documentationFileId = api.documentationFileId;

    // Convert to Mongo ObjectID
    const objectId = new Mongo.Collection.ObjectID(documentationFileId);

    // Remove documentation object
    DocumentationFiles.remove(objectId);
  },
  removeMonitoring (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Remove monitoring data collection
    MonitoringData.remove({ apiId });

    // Remove monitoring settings collection
    MonitoringSettings.remove({ apiId });
  },
  removeOrganizationApiLink (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get related organizationApis document
    const organizationApiLink = OrganizationApis.findOne({ apiId });

    // Make sure document exists
    if (organizationApiLink) {
      // Delete document
      OrganizationApis.remove({ _id: organizationApiLink._id });
    }
  },
});
