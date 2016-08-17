import { Proxies } from '../collection';

Meteor.publish('allProxies', () => {
  return Proxies.find();
});
