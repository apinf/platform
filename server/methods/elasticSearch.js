Meteor.methods({
  "getChartData": function (data) {

    // get userId

    // get user object

    // get user's api_key

    // get user role

    // check user role

    // construct query depending on user role

    // if admin - match_all

    // else - match api_key: api_key

    var loggedInUser = Meteor.user();

    if (Roles.userIsInRole(loggedInUser, ['admin'])) {
      // NOTE: This example assumes the user is not using groups.
      console.log("User is admin");
    }

    var newSearch = new ElasticRest(
      data.index,
      data.type,
      data.limit,
      data.apiKey,
      data.fields
    );

    return newSearch.doSearch();
  }
});
