import { Settings } from '../collection';

Template.settings.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.settings.helpers({
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
