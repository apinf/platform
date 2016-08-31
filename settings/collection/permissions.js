import { Settings } from '../collection';

Settings.allow({
  insert () {
    // get settings
    const dbSettingsCount = Settings.find().count();
    // if no settings exist
    if (dbSettingsCount > 0) {
      // don't allow insert
      return false;
    } else {
      // insert
      return true;
    }
  },
  update () {
    return true;
  },
});
