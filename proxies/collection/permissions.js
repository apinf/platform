import { Roles } from 'meteor/alanning:roles';
import Proxies from './';

Proxies.allow({
  insert (userId) {
    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
  update (userId) {
    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId) {
    // Check if user has admin role
    return Roles.userIsInRole(userId, ['admin']);
  },
});
