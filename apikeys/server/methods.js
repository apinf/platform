import { Proxies } from '/proxies/collection';

Meteor.methods({
  createApiKey () {
    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if (currentUser) {
      // TODO: Fix for multi-proxy support
      const proxy = Proxies.findOne();

      // Check type
      if(proxy && proxy.type === "apiUmbrella") {
        // Call Umbrella method to create user with API key
        Meteor.call('createApiUmbrellaUser', function(result, error) {
          if(error) {
            console.log(error);
          } else {
            /*
            // Set fieldsToBeUpdated
            const fieldsToBeUpdated = {
              'apiUmbrellaUserId': response.data.user.id,
              'profile.apiKey': response.data.user.api_key,
            };

            // Update currentUser
            Meteor.users.update({ _id: currentUser._id }, { $set: fieldsToBeUpdated });

            */
          }

        });
      }
    } else {
      // Meteor Error (User not logged in)
      throw new Meteor.Error(
        'apinf-usernotloggedin-error',
        TAPi18n.__('apinf_usernotloggedin_error')
      );
    }
  }
});
