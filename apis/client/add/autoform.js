AutoForm.hooks("addApiForm", {
  before: {
    insert (api) {
      // Get current user ID
      const userId = Meteor.userId()

      // Add current user as API manager
      api.managerIds = [userId];

      // Submit the form
      return api;
    }
  },
  onSuccess (formType, apiId) {
    // Redirect to newly added API
    Router.go("viewApiBackend", { _id: apiId });
  }
})
