Meteor.methods({
  'checkApi' : function (apiUrl) {

    this.unblock();

    try {

      // response object from apinf GET request
      var result = Meteor.http.call("GET", apiUrl);

      // Log the HTTP Status Code
      console.log(result);

      // checks is the status code matches 200
      return result.statusCode == 200;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(error);

      return false;
    }
}});
