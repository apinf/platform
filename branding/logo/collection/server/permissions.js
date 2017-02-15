// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import ProjectLogo from '/branding/logo/collection';

ProjectLogo.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  read () {
    return true;
  },
  write () {
    return true;
  },
});
