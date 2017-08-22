/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '../';

Meteor.publish('proxyBackends', function (proxyId) {
  // Make sure proxyId is a String
  check(proxyId, String);

  // Get current userId
  const userId = this.userId;
  // Check loggedin user exists
  if (userId) {
    // Return list of all proxyBackends for given proxy
    return ProxyBackends.find({ proxyId });
  }
  // Otherwise return empty list
  return [];
});

// Publish specified proxy backend and related data about Proxy and related API
Meteor.publishComposite('proxyBackendRelatedData', (id) => {
  check(id, String);
  return {
    find () {
      return ProxyBackends.find(id);
    },
    children: [
      {
        find (proxyBackend) {
          return Proxies.find(proxyBackend.proxyId);
        },
      },
      {
        find (proxyBackend) {
          return Apis.find(proxyBackend.apiId);
        },
      },
    ],
  };
});
