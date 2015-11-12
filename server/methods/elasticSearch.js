Meteor.methods({
  "getChartData": function (data) {

    // initialise variables
    var loggedInUser, apiKey, query, searchResults;

    // get user object
    loggedInUser = Meteor.user();

    // get user role & check user role
    if (Roles.userIsInRole(loggedInUser, ['admin'])) {

      // if admin - match_all
      // construct query
      query = {
        match_all: {}
      }

    } else{

      // else - user - match api_key: api_key

      // get user's api_key
      apiKey  = loggedInUser.profile.apiKey;

      // construct query
      query   = {
        "match": {
          "api_key": apiKey
        }
      }

    }

    // New instance of ElasticRest class with query as constructor
    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      query,
      data.fields
    );

    // Try catch - if search fails, returns user - friendly error
    try{

      searchResults = newSearch.doSearch();

    }catch(err){

      // Providing empty object to be returned within "isOk:false" for consistency
      throw new Meteor.Error(500, 'Analytics data is not found.');
    }

    return searchResults;
  }
});
