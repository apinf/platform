import { Meteor } from 'meteor/meteor';

import { Roles } from 'meteor/alanning:roles';

// Apinf import
import { Apis } from '/apis/collection';
import { ProxyBackends } from '/proxy_backends/collection';

// npm import
import _ from 'lodash';

Meteor.publish('apiProxySettings', function (apiId) {
  // TODO: determine how to use 'api.userCanEdit()' helper
  // which uses 'Meteor.userId()' instead of 'this.userId'

  // Get current userId
  const userId = this.userId;

  // Check that user is logged in
  if (userId) {
    // Get API document
    const api = Apis.findOne(apiId);

    // Check if user is API manager
    const userIsManager = _.includes(api.managerIds, userId);

    // Check if user is administrator
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check if user is authorized to access API proxy settings
    if (userIsManager || userIsAdmin) {
      return ProxyBackends.find({ apiId });
    }
  }

  // Complete publication execution
  return this.ready();
});

Meteor.publish('proxyApis', function () {

  // TODO: pass proxy Id to this publication ?

  // Placeholder for proxy backends
  let proxyBackends = [];

  // Get current user Id
  const userId = this.userId;

  if (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // If current user is admin
    if (userIsAdmin) {
      // Get list of all the endpoints
      proxyBackends = ProxyBackends.find();
    }

    // If current user is manager
    const managedApis = Apis.find({ managerIds: userId }).fetch();

    // If user is manager
    if (managedApis.length > 0) {
      // Get list of proxy backends managed by current user
      _.forEach(managedApis, (api) => {
        _.concat(proxyBackends, ProxyBackends.find({ apiId: api._id }).fetch());
      });
    }
  }

  return proxyBackends;
});
