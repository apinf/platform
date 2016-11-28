import { Roles } from 'meteor/alanning:roles';
import { Organizations } from './';

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
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin/owner can update
    if (userIsAdmin && organization.currentUserCanEdit()) {
      return true;
    }

    return false;
  },
  remove (userId, organization) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin/owner can update
    if (userIsAdmin && organization.currentUserCanEdit()) {
      return true;
    }

    return false;
  },
});
