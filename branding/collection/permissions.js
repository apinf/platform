// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Branding from './';

Branding.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin']) && Branding.find().count() === 0;
  },
  update (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
});
