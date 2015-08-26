Template.viewApiBackend.created = function() {
  // Create reference to instance
  var instance = this;

  // Get the API Backend ID from the route
  var backendId = Router.current().params.apiBackendId;

  // Subscribe to a single API Backend, by ID
  instance.subscribe("apiBackend", backendId);
};

Template.viewApiBackend.rendered = function () {

  var apiBackend = ApiBackends.find().fetch();

  var url = apiBackend[0].backend_protocol + "://" + apiBackend[0].backend_host;

  Meteor.call("checkApi", url, function (err, status) {

    if (status) {

      console.log("UP!");

      $('#apiState').addClass('alert-success').html("API is operating normally.");

    }else{

      console.log("DOWN!");

      $('#apiState').addClass('alert-danger').html("API backend is down for some reason. Please contact support.");

    }

  });

};
