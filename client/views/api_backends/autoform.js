AutoForm.hooks({
  apiBackends: {
    onSuccess: function (formType, backendId) {
      // Send the API Backend to API Umbrella
      Meteor.call('createApiBackendOnApiUmbrella', backendId);
    }
  }
});
