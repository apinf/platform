// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Apis from '/apis/collection';
import ProxyBackends from '/proxy_backends/collection';

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

Meteor.publish('apiProxySettings', function (apiId) {
  // Make sure apiId is a String
  check(apiId, String);

  // Get current userId
  const userId = this.userId;

  // Check that user is logged in
  if (userId) {
    // Return APIs proxy settings
    return ProxyBackends.find({ apiId });
  }

  // Complete publication execution
  return this.ready();
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
