Template.viewApiBackendDetails.helpers({
  currentUserCanEditApiBackend: function() {
    // Get current API backend ID
    var apiBackend = this.apiBackend;

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
