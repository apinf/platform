// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Organizations from './';

Organizations.allow({
  insert (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin can insert
    if (userIsAdmin) {
      return true;
    }

    return false;
  },
  update (userId, organization) {
    // Check if current user can update
    return organization.currentUserCanManage();
  },
  remove (userId, organization) {
    // Check if current user can remove
    return organization.currentUserCanManage();
  },
});
