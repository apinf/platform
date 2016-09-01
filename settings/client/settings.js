import { Settings } from '../collection';

Template.settings.onCreated(function () {
  // Subscription to feedback collection
  this.subscribe('settings');
});

Template.settings.helpers({
  settingsCollection () {
    // Return a reference to the Settings collection, for AutoForm
    return Settings;
  },
  formType () {
    // Form type placeholder
    let formType;

    if (Settings.findOne()) {
      // Updating existing Settings
      formType = 'update';
    } else {
      // Editing Settings
      formType = 'insert';
    }

    return formType;
  },
  editDoc () {
    if (Settings.findOne()) {
      return Settings.findOne();
    }
  },
});
