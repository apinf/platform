import { Proxies } from './';
import { Roles } from 'meteor/alanning:roles';

Proxies.allow({
  insert (userId, proxy) {
    // Check if proxy is already exist
    if (Proxies.find().count() >= 1) {
      return false;
    }

    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
  update (userId, proxy) {
    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId, proxy) {
    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
});
