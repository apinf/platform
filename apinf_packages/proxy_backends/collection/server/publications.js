/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

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

Meteor.publish('proxyApis', function () {
  // TODO: pass proxy Id to this publication ?

  // Get current user Id
  const userId = this.userId;

  if (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // If current user is admin
    if (userIsAdmin) {
      // Get list of all the endpoints
      return ProxyBackends.find();
    }

    // If current user is manager
    const managedApis = Apis.find({ managerIds: userId }).fetch();
    // If user is manager
    if (managedApis.length > 0) {
      // Create an empty list for saving selector
      const apisSelector = [];
      // Add the condition to find proxy backend configuration
      _.forEach(managedApis, (api) => {
        apisSelector.push({ apiId: api._id });
      });
      // Get list of proxy backends managed by current user
      return ProxyBackends.find({ $or: apisSelector });
    }
  }
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
