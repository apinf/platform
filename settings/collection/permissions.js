// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Settings from './';

Settings.allow({
  insert (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check if settings exist (settings count is zero)
    const noSettingsExist = Settings.find().count() === 0;

    // Insert if no settings exist
    return (userIsAdmin && noSettingsExist);
  },
  update (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin can update
    return !!(userIsAdmin);
  },
});
