Template.viewApiBackendMetadata.helpers({
  canEditMetadata: function() {
    // Get current API backend ID
    var apiBackendId = this.apiBackend._id;

    // Find related API Backend that contains "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
