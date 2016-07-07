import { ApiMetadata } from '/metadata/collection/collection';

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
  },
  metadata () {
    // Get the API Backend ID from the route
    let apiBackendId = Router.current().params._id;

    // Get API Backend metadata
    let apiMetadata = ApiMetadata.findOne({apiBackendId});

    return apiMetadata;
  }
});
