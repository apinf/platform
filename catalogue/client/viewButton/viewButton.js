Template.viewApiBackendButton.events({
  "click button": function (/*event, template*/) {
    // Get reference to API Backend object
    var apiBackend = this;

    // Redirect to the API Backend page
    Router.go('viewApiBackend', {_id: apiBackend._id});
  }
});
