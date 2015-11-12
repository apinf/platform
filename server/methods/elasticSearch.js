Meteor.methods({
  "getChartData": function (data) {

    // initialise variables
    var loggedInUser, apiKey, query, searchResults;
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

    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      query,
      data.fields
    );

    try{
      searchResults = newSearch.doSearch();
      isOk = true;
    }catch(err){
      searchResults = {};
    }

    return {
      isOk: isOk,
      searchResults: searchResults
    };
  }
});
