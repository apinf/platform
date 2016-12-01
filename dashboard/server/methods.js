import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
// Collection import
import { Proxies } from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Meteor.methods({
  getProxyData (proxyBackendId) {
    // Get proxy backend configuration
    const proxyBackend = ProxyBackends.findOne(proxyBackendId);

    if (proxyBackend && proxyBackend.proxyId) {
      // Get proxy
      const proxy = Proxies.findOne(proxyBackend.proxyId);

      const response = {};

      // Check existing of proxy, existing of proxy type
      if (proxy && proxy.type) {
        // save type
        response.proxyType = proxy.type;

        switch (proxy.type) {
          case 'apiUmbrella':
            // save fronted prefix
            response.frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;
            // save url
            response.elasticSearchUrl = proxy.apiUmbrella.elasticsearch;
            break;
          case 'emqtt':
            // TODO: Add fronted prefix if eMQTT protocol has it
            // save url
            response.elasticSearchUrl = proxy.emqtt.elasticsearch;
            break;
          default:
            // Create & throw message about error
            const message = TAPi18n.__('dashboard_errorMessage_unknownProxyType');
            throw new Meteor.Error(message);
        }

        // Return proxy data
        return response;
      }

      // Create & throw message about error
      const message = TAPi18n.__('dashboard_errorMessage_noProxyFound');
      throw new Meteor.Error(message);
    }
    // Create & throw message about error
    const message = TAPi18n.__('dashboard_errorMessage_noProxybackendFound');
    throw new Meteor.Error(message);
  },
});

