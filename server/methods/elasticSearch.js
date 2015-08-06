Meteor.methods({
  "getChartData": function (data) {

    // initialise variables
    var loggedInUser;
    var apiKey;
    var query;

    // get user object
    loggedInUser = Meteor.user();

    // get user role & check user role
    // if admin - match_all
    if (Roles.userIsInRole(loggedInUser, ['admin'])) {

      // construct query
      query = {
        match_all: {}
      }
    } else
    // if owner ...
    if (Roles.userIsInRole(loggedInUser, ['owner'])) {

      // ,,,

    }else{

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

    return newSearch.doSearch();
  }
});
