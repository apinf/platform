Meteor.methods({
  'getApiStatus' : function (apiUrl) {

    this.unblock();

    let status = {
      code: 0,
      errorMessage: "",
      responseContext: {}
    };

    try {

      // response object from GET request to api host
      const result = Meteor.http.call("GET", apiUrl);

      // Check that we get result and get statusCode
      if(result) {

        // Get statusCode
        status.code = result.statusCode;

        // Keep the entire response object
        status.responseContext = result;
      }

      return status;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      // keeps error message

      status.code = error.response.statusCode;
      status.errorMessage = error;

      return status;
    }
}});
