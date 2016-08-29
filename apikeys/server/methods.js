Meteor.methods({
  // Create API key & attach it for given user,
  // Might throw errors, catch on client callback
  createApiKeyForCurrentUser () {
    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if(currentUser) {
      // Check apiUmbrellaWeb global object exists
      if (apiUmbrellaWeb) {
        // Create API Umbrella user object with required fields
        const apiUmbrellaUserObj = {
          "user": {
            "email": currentUser.emails[0].address,
            "first_name": "-",
            "last_name": "-",
            "terms_and_conditions": true
          }
        };

        // Try to create user on API Umbrella
        try {
          // Add user on API Umbrella
          const response = apiUmbrellaWeb.adminApi.v1.apiUsers.createUser(apiUmbrellaUserObj);

          // Set fieldsToBeUpdated
          const fieldsToBeUpdated = {
            'apiUmbrellaUserId': response.data.user.id,
            'profile.apiKey': response.data.user.api_key
          };

          // Update currentUser
          Meteor.users.update({_id: currentUser._id}, {$set: fieldsToBeUpdated});

          // Insert full API Umbrella user object into API Umbrella Users collection
          ApiUmbrellaUsers.insert(response.data.user);
        } catch (error) {
          // Meteor Error (User create failed on Umbrella)
          throw new Meteor.Error(
            "umbrella-createuser-error",
            TAPi18n.__("umbrella_createuser_error")
          );
        }
      } else {
        // Meteor Error (apiUmbrellaWeb not defined)
        throw new Meteor.Error(
          "umbrella-notdefined-error",
          TAPi18n.__("umbrella_notdefined_error")

        );
      }
    } else {
      // Meteor Error (User not logged in)
      throw new Meteor.Error(
        "apinf-usernotloggedin-error",
        TAPi18n.__("apinf_usernotloggedin_error")
      );
    }
  }
});
