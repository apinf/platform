Template.viewApiBackendMetadata.helpers({
  currentUserCanEditMetadata: function() {
    /*
     API Metadata shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get current API backend ID
    var apiBackend = this.apiBackend;

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  }
});
