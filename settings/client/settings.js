import { Settings } from '/settings/collection';

Template.settings.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.settings.helpers({
  settingsCollection () {
    // Return reference to Settings collection, for AutoForm
    return Settings;
  },
  formType () {
    if (Settings.findOne()) {
      // Updating existing Settings
      return 'update';
    } else {
      // Editing Settings
      return 'insert';
    }
  },
  editDoc () {
    return Settings.findOne();
  },
});
