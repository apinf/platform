import { Settings } from '../collection';

Template.settings.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.settings.helpers({
  formType: function () {
    if ( Settings.findOne() ) {
      // Updating existing Settings
      return 'update';
    } else {
      // Editing Settings
      return 'insert';
    }
  },
  editDoc: function(){
    return Settings.findOne();
  },
  settingsCollection () {
    // Return a reference to settings collection
    return Settings;
  }
});
