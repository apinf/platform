import { Roles } from 'meteor/alanning:roles';

import ApiFlags from './';


ApiFlags.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
});
