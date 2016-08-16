import { Apis } from '/apis/collection/collection';

Template.apiBacklog.helpers({
  currentUserCanEditBacklog: function() {
    /*
     API Backlog shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get current API backend ID
    var apiBackendId = this.apiBackend._id;

    // Find related API Backend that contains "managerIds" field
    var apiBackend = Apis.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
