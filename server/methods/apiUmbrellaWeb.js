import { apiUmbrellaSettigsValid } from '/lib/helperFunctions/validateSettings/apiUmbrellaSettigsValid';

Meteor.methods({
  "syncApiUmbrellaUsers": function () {

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
  },
  "createApiUmbrellaWeb": function () {

    const settings = Settings.findOne();

    // Check if something is on Settings collection
    if (apiUmbrellaSettigsValid(settings)) {

      // Create config object for API Umbrella Web interface from Settings collection
      var config = {
        baseUrl: settings.apiUmbrella.baseUrl,
        apiKey: settings.apiUmbrella.apiKey,
        authToken: settings.apiUmbrella.authToken
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
