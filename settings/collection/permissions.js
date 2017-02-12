import Settings from './';

Settings.allow({
  insert (userId, settings) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Check if settings exist (settings count is zero)
    const noSettingsExist = Settings.find().count() === 0;

    // if no settings exist
    if (userIsAdmin && noSettingsExist) {
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
