import { ApiMetadata } from '/metadata/collection/collection';

Template.viewApiBackendMetadata.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to metadata for this API Backend
  instance.subscribe("apiMetadata", instance.data.apiBackend._id);
});

Template.viewApiBackendMetadata.helpers({
  currentUserCanEditMetadata: function() {
    /*
     API Metadata shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get reference to template instance
    const instance = Template.instance();

    // Get current API backend ID
    var apiBackend = instance.data.apiBackend;

    // Check if current user can edit API Backend
    return apiBackend.currentUserCanEdit();
  },
  metadata () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get the API Backend ID from template instance
    let apiBackendId = instance.data.apiBackend._id;

    // Get API Backend metadata
    let apiMetadata = ApiMetadata.findOne({apiBackendId});

    return apiMetadata;
  }
});
