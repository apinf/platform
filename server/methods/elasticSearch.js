Meteor.methods({
  "getChartData": function (data) {

    // initialise variables
    var loggedInUser, apiKey, query, searchResults;

    // default value for search status
    var isOk = false;

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

    // Try catch - if search fails, returns user - friendly status
    try{

      searchResults = newSearch.doSearch();

      // Changes "isOk" state to true if "try{}" didn't break before
      isOk = true;

    }catch(err){

      // Providing empty object to be returned within "isOk:false" for consistency
      searchResults = {};
    }

    return {
      isOk: isOk,
      searchResults: searchResults
    };
  }
});
