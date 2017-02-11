import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

import ApiKeys from '/api_keys/collection';
import Proxies from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Meteor.methods({
  createApiKey (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get logged in user
    const currentUser = Meteor.user();
    // Check currentUser exists
    if (currentUser) {
      const proxyBackend = ProxyBackends.findOne({ apiId });

      // Check proxyBackend is defined, and it has proxyId
      if (proxyBackend && proxyBackend.proxyId) {
        // Get Proxy by proxyId of proxyBackend
        const proxyId = proxyBackend.proxyId;
        const proxy = Proxies.findOne({ _id: proxyId });

        // Check type & call appropriate function
        if (proxy && proxy.type === 'apiUmbrella') {
          // Call Umbrella method to create user with API key
          Meteor.call('createApiUmbrellaUser', currentUser, proxyId, (error, umbrellaUser) => {
            if (error) {
              // Log error for server
              // eslint-disable-next-line no-console
              console.log(error);
              // Throw apiumbrellauser error for client
              throw new Meteor.Error(
                'apinf-apiumbrellauser-error',
                TAPi18n.__('apinf_apiumbrellauser_error')
              );
            } else {
              // Construct apiKey object
              const apiKey = {
                apiUmbrella: {
                  id: umbrellaUser.id,
                  apiKey: umbrellaUser.api_key,
                },
                userId: currentUser._id,
                proxyId: proxy._id,
              };

              // Insert apiKey
              ApiKeys.insert(apiKey);
            }
          });
        } else {
          // Throw no proxy error for client
          throw new Meteor.Error(
            'apinf-noproxy-error',
            TAPi18n.__('apinf_noproxy_error')
          );
        }
      } else {
        // Throw no proxybackend error for client
        throw new Meteor.Error(
          'apinf-noproxybackend-error',
          TAPi18n.__('apinf_noproxybackend_error')
        );
      }
    } else {
      // Throw usernotloggedin error for client
      throw new Meteor.Error(
        'apinf-usernotloggedin-error',
        TAPi18n.__('apinf_usernotloggedin_error')
      );
    }
  },
});
