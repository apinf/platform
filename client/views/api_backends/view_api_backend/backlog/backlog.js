Template.apiBacklog.created = function () {
  // Get reference to template instance
  const instance = this;

  // Get API Backend ID from data context
  const apiBackendId = instance.data.apiBackend._id;

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe("apiBacklogItems", apiBackendId);
};

Template.apiBacklog.helpers({
  currentUserIsApiManager: function () {
    var apiBackend = this.apiBackend;

    // Make sure current user is API Backend manager
    return apiBackend.currentUserIsManager();
  }
});
