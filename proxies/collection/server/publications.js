// Meteor packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Roles } from 'meteor/alanning:roles';

// Collection imports
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
