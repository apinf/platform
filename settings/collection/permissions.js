import { Settings } from './';

Settings.allow({
  insert (userId, settings) {
    // get settings
    const dbSettingsCount = Settings.find().count();

    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // if no settings exist
    if (dbSettingsCount > 0) {
      // don't allow insert
      return false;
    } else if (userIsAdmin) {
      // insert
      return true;
    }
  },
  update (userId, settings) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin can update
    if (userIsAdmin) {
      return true;
    }
  },
});
