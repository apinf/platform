Template.viewApiBackendMetadata.helpers({
  canEditMetadata: function() {
    // Get current userId
    var userId = Meteor.userId();

    // Check that user is logged in
    if( userId ) {
      // Get current API backend ID
      var apiBackendId = this.apiBackend._id;

      // Find related API Backend that contains "managerIds" field
      var apiBackend = ApiBackends.findOne(apiBackendId, {fields: {managerIds: 1}});

      // Try - Catch wrapper here because Mongodb call above can return zero matches
      try {
        // Get managerIds array from API Backend document
        var managerIds = apiBackend.managerIds;
      } catch (err) {
        // If no related document found return false - API Backend does not have any managers listed
        return false;
      }

      // Check if an array of managerIds contain user id passed
      var isManager = _.contains(managerIds, userId);
      // Check if user is administrator
      var isAdmin = Roles.userIsInRole(userId, ['admin']);

      // Check that user is either API manager OR Admin
      if(isManager || isAdmin) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
});
