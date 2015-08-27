Template.viewApiBackend.created = function() {

  // Create reference to instance
  var instance = this;

  // Get the API Backend ID from the route
  var backendId = Router.current().params.apiBackendId;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", backendId);

};

Template.viewApiBackend.rendered = function () {

  // fetches current apiBackend
  var apiBackend = ApiBackends.findOne();

  // sets up request url based on protocol and host
  var url = apiBackend.backend_protocol + "://" + apiBackend.backend_host;

  Meteor.call("checkApi", url, function (err, status) {

    if (status) {

      // updates layout with success status
      $('#apiState').addClass('alert-success').html("API is operating normally.");

    }else{

      // updates layout with success status
      $('#apiState').addClass('alert-danger').html("API backend is down for some reason. Please contact support.");

    }

  });

};
