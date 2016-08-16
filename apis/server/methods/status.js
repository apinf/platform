Meteor.methods({
  'getApiStatus' : function (uri) {

    this.unblock();

    // Init empty status object
    let status = {
      code: 0,
      errorMessage: "",
      responseContext: {}
    };

    // Try-catch wrapper
    // Because if requested host is not available, error is thrown
    try {

      // response object from GET request to api host
      const result = Meteor.http.call("GET", uri);

      // Check result is received
      if(result) {

        // Get response status code
        status.code = result.statusCode;

        // Keep response object
        status.responseContext = result;
      }

      return status;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      
      // Check if "ECONNREFUSED" is reveived
      if (!error.response && error.code === 'ECONNREFUSED') {

        // Provide 404 error
        status.code = 404;

      } else {

        // Keep response error code
        status.code = error.response.statusCode;

      }

      // Keep reponse error message
      status.errorMessage = error;

      return status;
    }
}});
