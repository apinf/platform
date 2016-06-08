import ElasticSearch from "elasticsearch";

Meteor.methods({
  "getChartData": function (data) {
    console.log("getting chart data");
    // Check if user is logged in
    if (Meteor.user()) {

      // Initialise variables
      var loggedInUser, apiKey, query, searchResults;

      // Get user object
      loggedInUser = Meteor.user();

      const settings = Settings.findOne();

      try {
        var config = {
          host: settings.elasticsearch.host
        };
      } catch (error) {
        // Throw an error to inform the user
        console.log(error.message);

        // return false to break out of the function
        return false;
      }

      // Create a new ElasticRest instance
      var esClient = new ElasticSearch.Client(config);

      // Get user role & check user role
      if (Roles.userIsInRole(loggedInUser, ['admin'])) {

        // If current user is Admin
        // Construct query with no filters (See elasticsearch docs - https://www.elastic.co/guide/index.html)
        query = {
          match_all: {},
        }

      } else {
        // Get user's api_key
        apiKey  = loggedInUser.profile.apiKey;

        // Construct query based on user's api key
        query   = {
          "match": {
            "api_key": apiKey
          }
        }
      }

      var options = {
        index: data.index,
        type: data.type,
        size: data.limit,
        body: {
          query: query,
          // TODO:
          // check needs to be implemented, see wrapper meteor-elastic-rest
          fields: data.fields
        }
      };

      return esClient.search(options).then( (result) => {
        console.log("Got result...");
        //console.log(result);
        return result;
      }).catch( (err) => {
        console.trace(err.message);
        // Throw a 500 error explaining that the data was not found
        throw new Meteor.Error(500, "Analytics data is not found.");
      });

   } else {
     // Throw a 500 error
     throw new Meteor.Error(500, "User is not authorised.");

     return false;
   }
 }
});
