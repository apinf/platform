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

  Meteor.call("getApiStatus", url, function (err, status) {

    // status object contents:
    // status = {
    //   isUp            : <boolean>,
    //   statusCode      : <integer>,
    //   responseContext : <object>,
    //   errorMessage    : <String>
    // };

    if (status.isUp) {

      // updates layout with success status
      $('#apiState').addClass('alert-success').html("API is operating normally.");

    }else{

      // initial error message
      var errorMessage = "API backend is down for some reason. Please contact support.";

      // updates layout with success status
      $('#apiState').addClass('alert-danger').html(errorMessage);

    }

    // showing when check did happen
    $('#whenUpdated').html("Just now");

  });

};
