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
  },
  "createApiUmbrellaWeb": function () {
    // Check if something is on Settings collection
    if ( Settings.findOne() ) {
      // Create config object for API Umbrella Web interface from Settings collection
      var config = {
        baseUrl: Settings.findOne().apiUmbrella.baseUrl,
        apiKey: Settings.findOne().apiUmbrella.apiKey,
        authToken: Settings.findOne().apiUmbrella.authToken
      };
    } else {
      // Create config object for API Umbrella Web interface from Meteor.settings
      var config = {
        baseUrl: Meteor.settings.apiUmbrella.baseUrl,
        apiKey: Meteor.settings.apiUmbrella.apiKey,
        authToken: Meteor.settings.apiUmbrella.authToken
      };
    }
    try {
      // Create API Umbrella Web object for REST calls
      apiUmbrellaWeb = new ApiUmbrellaWeb(config);
    } catch (error) {
      console.log(error);
    }
  }
});
