AutoForm.hooks({
  apiBackends: {
    onSuccess: function (formType, backendId) {
      // Send the API Backend to API Umbrella
      Meteor.call('createApiBackendOnApiUmbrella', backendId);
      sAlert.success('New API was successfully submitted!');
      Router.go('manageApiBackends');
    }
  }
});

Meteor.startup(function () {

  sAlert.config({
    effect: '',
    position: 'top',
    timeout: 5000,
    html: false,
    onRouteClose: true,
    stack: true,
    beep: false
  });

});
