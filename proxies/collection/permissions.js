import { Proxies } from './';
import { Roles } from 'meteor/alanning:roles';

Proxies.allow({
  insert (userId, proxy) {
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
