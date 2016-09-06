import { apiUmbrellaSettingsValid } from '/lib/helperFunctions/validateSettings';
import { Settings } from '/settings/collection';
import { Proxies } from '/proxies/collection';

Meteor.methods({
  'syncApiUmbrellaUsers': function () {
    // Check if apiUmbrellaWeb object exists
    if (typeof apiUmbrellaWeb !== 'undefined') {
      // Get users from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.apiUsers.getUsers();

      // Add each user to collection if not already there
      const apiUsers = response.data.data;

      _.each(apiUsers, function (apiUser) {
        // Get existing user
        const existingUser = ApiUmbrellaUsers.findOne({ 'id': apiUser.id });

        // If user doesn't exist in collection, insert into collection
        if (existingUser === undefined) {
          ApiUmbrellaUsers.insert(apiUser);
        }
      });
    }
  },
  'createApiUmbrellaWeb': function () {
    // TODO: Fix for multi-proxy support
    const proxy = Proxies.findOne();

    // Check if API Umbrella Web settings are valid
    if (apiUmbrellaSettingsValid(proxy)) {
      // Create config object for API Umbrella Web REST API
      const config = {
        baseUrl: proxy.apiUmbrella.url + '/api-umbrella/',
        apiKey: proxy.apiUmbrella.apiKey,
        authToken: proxy.apiUmbrella.authToken,
      };

      try {
        // Create new API Umbrella Web object for REST calls
        const apiUmbrellaWeb = new ApiUmbrellaWeb(config);
        // Return created object
        return apiUmbrellaWeb;
      } catch (error) {
        console.log(error);
      }
    }
  },
  'syncApiUmbrellaAdmins': function () {
    if (typeof apiUmbrellaWeb !== 'undefined') {
      // Get admin users from API Umbrella instance
      const response = apiUmbrellaWeb.adminApi.v1.adminUsers.getAdmins();

      // Add each admin user to collection if not already there
      const apiAdmins = response.data.data;

      _.each(apiAdmins, function (apiAdmin) {
        // Get existing admin user
        const existingAdminUser = ApiUmbrellaAdmins.findOne({ 'id': apiAdmin.id });

        // If admin user doesn't exist in collection, insert into collection
        if (existingAdminUser === undefined) {
          ApiUmbrellaAdmins.insert(apiAdmin);
        }
      });
    }
  },
  // Create API key & attach it for given user,
  // Might throw errors, catch on client callback
  createApiKeyForCurrentUser () {
    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if (currentUser) {
      // Check apiUmbrellaWeb global object exists
      if (apiUmbrellaWeb) {
        // Create API Umbrella user object with required fields
        const apiUmbrellaUserObj = {
          'user': {
            'email': currentUser.emails[0].address,
            'first_name': '-',
            'last_name': '-',
            'terms_and_conditions': true,
          },
        };

        // Try to create user on API Umbrella
        try {
          // Add user on API Umbrella
          const response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);

          // Set fieldsToBeUpdated
          const fieldsToBeUpdated = {
            'apiUmbrellaUserId': response.data.user.id,
            'profile.apiKey': response.data.user.api_key,
          };

          // Update currentUser
          Meteor.users.update({ _id: currentUser._id }, { $set: fieldsToBeUpdated });

          // Insert full API Umbrella user object into API Umbrella Users collection
          ApiUmbrellaUsers.insert(response.data.user);
        } catch (error) {
          // Meteor Error (User create failed on Umbrella)
          throw new Meteor.Error(
            'umbrella-createuser-error',
            TAPi18n.__('umbrella_createuser_error')
          );
        }
      } else {
        // Meteor Error (apiUmbrellaWeb not defined)
        throw new Meteor.Error(
          'umbrella-notdefined-error',
          TAPi18n.__('umbrella_notdefined_error')

        );
      }
    } else {
      // Meteor Error (User not logged in)
      throw new Meteor.Error(
        'apinf-usernotloggedin-error',
        TAPi18n.__('apinf_usernotloggedin_error')
      );
    }
  },
});
