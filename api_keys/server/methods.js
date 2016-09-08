import { ApiKeys } from '/api_keys/collection';
import { Proxies } from '/proxies/collection';

Meteor.methods({
  createApiKey () {
    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if (currentUser) {
      // TODO: Fix for multi-proxy support
      const proxy = Proxies.findOne();

      // Check type & call appropriate function
      if(proxy && proxy.type === "apiUmbrella") {
        // Call Umbrella method to create user with API key
        Meteor.call('createApiUmbrellaUser', currentUser, function(error, umbrellaUser) {
          if(error) {
            console.log(error);
          } else {
            // Construct apiKey object
            const apiKey = {
              'apiUmbrella': {
                'id': umbrellaUser.id,
                'apiKey': umbrellaUser.api_key
              },
              'userId': currentUser._id,
              'proxyId': proxy._id
            };

            // Insert apiKey
            ApiKeys.insert(apiKey);
            console.log("ApiKey inserted");
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
