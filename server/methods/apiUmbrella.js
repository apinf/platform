import { apiUmbrellaSettingsValid } from '/lib/helperFunctions/validateSettings';

Meteor.methods({
  "syncApiUmbrellaUsers": function () {

    // Check if apiUmbrellaWeb object exists
    if ( typeof apiUmbrellaWeb !== 'undefined' ) {
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
    }
  },
  "createApiUmbrellaWeb": function () {

    const settings = Settings.findOne();

    // Check if API Umbrella Web settings are valid
    if (apiUmbrellaSettingsValid(settings)) {

      // Create config object for API Umbrella Web REST API
      var config = {
        baseUrl: settings.apiUmbrella.baseUrl,
        apiKey: settings.apiUmbrella.apiKey,
        authToken: settings.apiUmbrella.authToken
      };

      // Check whether API Umbrella Web instance exists
      if ( typeof apiUmbrellaWeb === 'undefined' ) {
        try {

          // Create new API Umbrella Web object for REST calls
          apiUmbrellaWeb = new ApiUmbrellaWeb(config);

        } catch (error) {

          console.log(error);
        }
      } else {
        try {
          // Update existing API Umbrella Web object with new settings
          apiUmbrellaWeb.baseUrl = config.baseUrl;
          apiUmbrellaWeb.apiKey = config.apiKey;
          apiUmbrellaWeb.authToken = config.authToken;
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  "syncApiUmbrellaAdmins": function () {

    if ( typeof apiUmbrellaWeb !== 'undefined' ) {

      // Get admin users from API Umbrella instance
      var response = apiUmbrellaWeb.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      var apiAdmins = response.data.data;

      _.each(apiAdmins, function (apiAdmin) {

        // Get existing admin user
        var existingAdminUser = ApiUmbrellaAdmins.findOne({'id': apiAdmin.id});

        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    }
  }
});
