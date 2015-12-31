Meteor.methods({
  "getChartData": function (data) {

    // Check if user is logged in
    if (Meteor.user()) {

      // Initialise variables
      var loggedInUser, apiKey, query, searchResults;

      // Get user object
      loggedInUser = Meteor.user();

      // Get user role & check user role
      if (Roles.userIsInRole(loggedInUser, ['admin'])) {

        // If current user is Admin
        // Construct query with no filters (See elasticsearch docs - https://www.elastic.co/guide/index.html)
        query = {
          match_all: {}
        }

      } else{

        // Get user's api_key
        apiKey  = loggedInUser.profile.apiKey;

        // Construct query based on user's api key
        query   = {
          "match": {
            "api_key": apiKey
          }
        }
      }

      var config = {
        host: Meteor.settings.elasticsearch.host
      };

      var options = {
        index: data.index,
        type: data.type,
        size: data.limit,
        query: query,
        fields: data.fields
      };

      // Create a new ElasticRest instance
      var es = new ElasticRest(config, options);

      // Try catch - if search fails, returns user friendly error
      try{

        searchResults = es.doSearch();

      }catch(err){

        // Throw a 500 error explaining that the data was not found
        throw new Meteor.Error(500, "Analytics data is not found.");
      }

      return searchResults;

    } else {

      // Throw a 500 error
      throw new Meteor.Error(500, "User is not authorised.");

    }
  }
});
