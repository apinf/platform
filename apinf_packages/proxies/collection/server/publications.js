/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apis/collection';
import ProxyBackends from '/proxy_backends/collection';
import Proxies from '../';

Meteor.publish('allProxies', function () {
  let proxies = [];

  // Check user permissions
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    proxies = Proxies.find();
  }

  return proxies;
});

Meteor.publish('proxyCount', function () {
  // Publish count of proxies
  Counts.publish(this, 'proxyCount', Proxies.find());
});

Meteor.publish('publicProxyDetails', () => {
  // Return all proxies with public data: name, url, type
  return Proxies.find({}, {
    fields: {
      _id: 1,
      name: 1,
      'apiUmbrella.url': 1,
      type: 1,
    },
  });
});

Meteor.publish('proxyWithCredentials', (proxyId) => {
  check(proxyId, String);

  // Fetch one proxy with full details by ID
  return Proxies.find(proxyId);
});

// Publish public details of specified ID and related data about Proxy Backend and related APIs
Meteor.publishComposite('proxyById', (id) => {
  check(id, String);

  return {
    find () {
      // Get proxy with specified ID and public fields: name, url, es host
      return Proxies.find(id,
        { name: 1, 'apiUmbrella.url': 1, 'apiUmbrella.elasticsearch': 1 });
    },
    children: [
      {
        find (proxy) {
          return ProxyBackends.find({ proxyId: proxy._id });
        },
        children: [
          {
            find (proxyBackend) {
              return Apis.find(proxyBackend.apiId);
            },
          },
        ],
      },
    ],
  };
});
