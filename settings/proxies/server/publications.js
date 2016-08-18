import { Proxies } from '../collection';

Meteor.publish('allProxies', function () {

  // Check user permissions
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Proxies.find();
  }
});
