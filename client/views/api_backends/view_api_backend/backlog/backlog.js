Template.apiBacklog.created = function () {
  // Get reference to template instance
  const instance = this;

  // Get API Backend ID from data context
  const apiBackendId = instance.data.apiBackend._id;

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe("apiBacklogItems", apiBackendId);
};

Template.apiBacklog.helpers({
  currentUserCanEditBacklog: function() {
    /*
     API Metadata shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get current API backend ID
    var apiBackendId = this.apiBackend._id;

    // Find related API Backend that contains "managerIds" field
    var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
