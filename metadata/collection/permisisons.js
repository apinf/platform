import { ApiMetadata } from '/metadata/collection/collection';
import { ApiBackends } from '/apis/collection/backend';

ApiMetadata.allow({
  "insert": function (userId, doc) {
    var apiBackendId = doc.apiBackendId;
    // Make sure there is only one document per API Backend ID
    if(ApiMetadata.find({apiBackendId}).count() !== 0) {
      return false;
    } else {
      // Find related API Backend, select only "managerIds" field
      var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

      // Check if current user can edit API Backend
      return apiBackend.currentUserCanEdit();
    }
  },
  "update": function (userId, doc) {
    // Get API Backend ID
    var apiBackendId = doc.apiBackendId;

    // Find related API Backend, select only "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
