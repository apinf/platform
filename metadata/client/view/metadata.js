import { ApiMetadata } from '../../collection';

Template.viewApiBackendMetadata.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to metadata for this API Backend
  instance.subscribe('apiMetadata', instance.data.api._id);
});

Template.viewApiBackendMetadata.helpers({
  currentUserCanEditMetadata () {
    /*
     API Metadata shares permissions with the API Backend
     Make sure user can edit API Backend before allowing Metadata permissions
    */

    // Get reference to template instance
    const instance = Template.instance();

    // Get current API backend ID
    const api = instance.data.api;

    // Check if current user can edit API Backend
    return api.currentUserCanEdit();
  },
  metadata () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get the API Backend ID from template instance
    const apiId = instance.data.api._id;

    // Get API Backend metadata
    // TODO: migrate ApiMetadata schema to use 'apiId' instead of 'apiBackendId'
    const apiMetadata = ApiMetadata.findOne({ apiBackendId: apiId });

    return apiMetadata;
  },
});
