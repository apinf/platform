// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
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
