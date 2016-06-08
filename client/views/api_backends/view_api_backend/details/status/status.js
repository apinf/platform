Template.viewApiBackendStatus.created = function() {
  // Create reference to instance
  var instance = this;

  // attaches function to template instance to be able to call it in outside
  instance.updateApiStatus = function (url) {

    Meteor.call("getApiStatus", url, function (err, status) {

      // status object contents:
      // status = {
      //   isUp            : <boolean>,
      //   statusCode      : <integer>,
      //   responseContext : <object>,
      //   errorMessage    : <String>
      // };

      if (status.isUp) {
        if(status.statusCode === 200) {
          // updates layout with success status
          $('#apiState')
            .addClass('alert-success')
            .html("API is operating normally.");
        }
        else if(status.statusCode === 401) {
          // updates layout with success status
          $('#apiState')
            .addClass('alert-success')
            .html("API requires authentication.");
        }
      } else {
        // initial error message
        var errorMessage = "API backend is down for some reason. Please contact support.";

        // updates layout with success status
        $('#apiState').addClass('alert-danger').html(errorMessage);
      }

      // show when check happened
      $('#whenUpdated').html("Just now");
    });
  };
};

Template.viewApiBackendStatus.rendered = function () {
  // Get reference to template instance
  var instance = this;

  // Get API Backend from instance data context
  var apiBackend = instance.data.apiBackend;

  // create request url based on API Backend protocol and host
  var url = apiBackend.backend_protocol + "://" + apiBackend.backend_host;

  // call the function that updates status
  instance.updateApiStatus(url);
};
