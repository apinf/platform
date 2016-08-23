AutoForm.hooks({
  "addApiForm": {
    before: {
      insert (api) {
        // Get current user ID
        const userId = Meteor.userId()

        // Add current user as API manager
        api.managerIds = [userId];

        // Set created & updated fields
        api.created_at = new Date();
        api.created_by = userId;
        api.updated_at = new Date();
        api.updated_by = userId;

        // Submit the form
        return api;
      }
    },
    onSuccess (formType, apiId) {
      // Redirect to newly added API
      Router.go("viewApiBackend", { _id: apiId });
    }
  }
});
