Template.viewApiBackendStatus.created = function() {

  // Create reference to instance
  const instance = this;

  // attaches function to template instance to be able to call it in outside
  instance.getApiStatus = function (url) {

    Meteor.call("getApiStatus", url, function (err, status) {

      // Status object contents:
      // status = {
      //   statusCode      : <integer>,
      //   responseContext : <object>,
      //   errorMessage    : <String>
      // };

      // Init indicator element
      const apiStatusIndicator = $('#api-status-indicator');

      // Init regEx for status codes
      const success = /^2[0-9][0-9]$/;
      const redirect = /^3[0-9][0-9]$/;
      const clientErr = /^4[0-9][0-9]$/;
      const serverErr = /^5[0-9][0-9]$/;

      // Check which status code is received
      // and display text depending on it
      if (success.test(status.code)) {

        apiStatusIndicator
          .addClass('alert-success')
          .attr('data-original-title', 'API is operating normally.');

      } else if (redirect.test(status.code)) {

        apiStatusIndicator
          .addClass('alert-warning')
          .attr('data-original-title', `${status.code} code. Redirection.`);

      } else if (clientErr.test(status.code)) {

        apiStatusIndicator
          .addClass('alert-warning')
          .attr('data-original-title', `${status.code} code. Client error.`);

      } else if (serverErr.test(status.code)) {

        apiStatusIndicator
          .addClass('alert-danger')
          .attr('data-original-title', `${status.code} code. Server error. Please contact support.`);
      }
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
  instance.getApiStatus(url);

  // Init tooltip
  $('#api-status-indicator').tooltip();
};
