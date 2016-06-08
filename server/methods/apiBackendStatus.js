Meteor.methods({
  'getApiStatus' : function (apiUrl) {

    this.unblock();

    var status = {
      isUp            : false,
      statusCode      : 0,
      responseContext : {},
      errorMessage    : ""
    };

    try {

      // response object from GET request to api host
      var result = Meteor.http.call("GET", apiUrl);

      // Check that we get result and get statusCode
      if( result ) {
        // Get statusCode
        status.statusCode = result.statusCode;

        // Keep the entire response object
        status.responseContext = result;

        // Status code checks
        if(result.statusCode === 200) {
          status.isUp = true;
        }
        else if(result.statusCode === 401) {
          status.isUp = true;
        }
        else {
          status.isUp = false;
        }
      }

      return status;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      // keeps error message
      status.errorMessage = error;

      return status;
    }
}});
