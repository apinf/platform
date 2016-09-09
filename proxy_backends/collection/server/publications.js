// Apinf import
import { Apis } from '/apis/collection';
import { ProxyBackends } from '/proxy_backends/collection';

// npm import
import { _ } from 'lodash';

Meteor.publish('apiProxySettings', function (apiId) {
  // TODO: determine how to use 'api.userCanEdit()' helper
  // which uses 'Meteor.userId()' instead of 'this.userId'

  // Placeholders for manager and admin checks
  let userIsManager, userIsAdmin;

  // Get current userId
  const userId = this.userId;

  // Check that user is logged in
  if (userId) {
    // Get API document
    const api = Apis.findOne(apiId);

    // Check if user is API manager
    userIsManager = _.includes(api.managerIds, userId);

    // Check if user is administrator
    userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check if user is authorized to access API proxy settings
    if (userIsManager || userIsAdmin) {
      return ProxyBackends.find({ apiId });
    }
  }
});
