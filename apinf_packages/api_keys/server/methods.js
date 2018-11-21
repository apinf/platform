// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ApiKeys from '/apinf_packages/api_keys/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Apis from '/apinf_packages/apis/collection';

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
  regenerateApiKey (apiId, apiKey) {
    // Make sure apiId is a string
    check(apiId, String);
    // Make sure apiKey is a string
    check(apiKey, String);
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
              // Throw apiumbrellauser error for client
              throw new Meteor.Error(
                'apinf-apiumbrellauser-error', TAPi18n.__('apinf_apiumbrellauser_error')
              );
            } else {
              // Construct apiKey object
              const newApiKey = {
                apiUmbrella: {
                  id: umbrellaUser.id,
                  apiKey: umbrellaUser.api_key,
                },
                userId: currentUser._id,
                proxyId: proxy._id,
              };

              // Insert apiKey
              ApiKeys.insert(newApiKey);

              // Remove collection
              ApiKeys.remove({ 'apiUmbrella.apiKey': apiKey });
            }
          });
        } else {
          // Throw no proxy error for client
          throw new Meteor.Error(
            'apinf-noproxy-error', TAPi18n.__('apinf_noproxy_error')
          );
        }
      } else {
        // Throw no proxybackend error for client
        throw new Meteor.Error(
          'apinf-noproxybackend-error', TAPi18n.__('apinf_noproxybackend_error')
        );
      }
    } else {
      // Throw usernotloggedin error for client
      throw new Meteor.Error(
        'apinf-usernotloggedin-error', TAPi18n.__('apinf_usernotloggedin_error')
      );
    }
  },
  getApisList (proxyId) {
    // Get logged in user
    const currentUser = Meteor.user();
    // Make sure proxyId is a string
    check(proxyId, String);
    // Get all APIs ID that are connected to specify Proxy
    const apiIds = ProxyBackends.find({ proxyId }).map(backend => { return backend.apiId; });
    // Find all APIs that are connected to Proxy
    const apisList = Apis.find({ _id: { $in: apiIds }, managerIds: currentUser._id }).fetch();

    return apisList;
  },
});
