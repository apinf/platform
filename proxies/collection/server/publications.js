import { Proxies } from '../';

Meteor.publish('allProxies', function () {
  // Check user permissions
  if (Roles.userIsInRole(this.userId, ['admin'])) {
    return Proxies.find();
  }
});

Meteor.publish('publicProxyDetails', function () {
  // Return all proxies
  // with only name and ID fields
  const publicProxyDetails = Proxies.find({}, {
    fields: {
      _id: 1,
      name: 1,
      'apiUmbrella.url': 1,
    },
  });

  return publicProxyDetails;
});
