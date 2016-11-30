import { Meteor } from 'meteor/meteor';
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

      // TODO: Change the condition of choose the proxy type when we have MQQT protocol
      // Check existing of proxy, existing of proxy type, existing of elastic search url
      if (proxy && proxy._id && proxy.apiUmbrella && proxy.apiUmbrella.elasticsearch) {
        // save id
        response.id = proxy._id;
        // save type
        response.proxyType = 'apiUmbrella';
        // save fronted prefix
        response.frontendPrefix = proxyBackend.apiUmbrella.url_matches[0].frontend_prefix;
        // save url
        response.elasticSearchUrl = proxy.apiUmbrella.elasticsearch;

        // return proxy data
        return response;
      }

      // Create & throw message about error
      const message = `No one proxy with ID ${proxyBackend.proxyId} was found`;
      throw new Meteor.Error(message);
    }
    // Create & throw message about error
    const message = `No one proxy backend configuration with ID ${proxyBackendId} was found`;
    throw new Meteor.Error(message);
  },
});

