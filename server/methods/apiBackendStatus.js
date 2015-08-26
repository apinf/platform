Meteor.methods({
  'checkApi' : function (apiUrl) {

    this.unblock();

    try {

      // response object from GET request to api host
      var result = Meteor.http.call("GET", apiUrl);

      // checks is the status code matches 200 and returns boolean
      return result.statusCode == 200;

    } catch (error) {

      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(error);

      return false;
    }
}});
