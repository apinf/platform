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

      // checks is the status code matches 200 and returns boolean
      status.isUp = result.statusCode == 200;

      // keeps status code value
      status.statusCode = result.satusCode;

      // keeps the entire response object
      status.responseContext = result;

      return status;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      // keeps error message
      status.errorMessage = error;

      return status;
    }
}});
