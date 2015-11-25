Meteor.methods({
  "syncApiUmbrellaUsers": function () {
    if (Meteor.settings.apiUmbrella) {
      // Get users from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.apiUsers.getUsers();

      // Add each user to collection if not already there
      var apiUsers = response.data.data;
      _.each(apiUsers, function (apiUser) {
        // Get existing user
        var existingUser = ApiUmbrellaUsers.findOne({'id': apiUser.id});
        // If user doesn't exist in collection, insert into collection
        if (existingUser === undefined) {
          ApiUmbrellaUsers.insert(apiUser);
        }
      });
    };
  }
});
