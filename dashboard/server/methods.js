/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Proxies from '/proxies/collection';
import ProxyBackends from '/proxy_backends/collection';

Meteor.methods({
  getProxyData (proxyBackendId) {
    // Make sure proxyBackendId is a String
    check(proxyBackendId, String);

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
            throw new Meteor.Error('Unknown proxy type');
        }

        // Return proxy data
        return response;
      }
      throw new Meteor.Error('No one proxy was found');
    }
    throw new Meteor.Error('No one proxy backend configuration was selected');
  },
});
