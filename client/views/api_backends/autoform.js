AutoForm.hooks({
  apiBackends: {
    onSuccess: function (formType, backendId) {
      // Send the API Backend to API Umbrella
      Meteor.call('createApiBackendOnApiUmbrella', backendId);
      // Redirect to the just created API Backend page
      Router.go('viewApiBackend', {_id: backendId});
    }
  }
});
