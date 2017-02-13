import { Template } from 'meteor/templating';
import Settings from '/settings/collection';
import $ from 'jquery';

Template.settings.onCreated(function () {
  // Subscription to feedback collection
  this.subscribe('settings');
});

Template.settings.onRendered(() => {
  // Initialize all popovers on a page
  $('[data-toggle="popover"]').popover();
});

Template.settings.helpers({
  settingsCollection () {
    // Return reference to Settings collection, for AutoForm
    return Settings;
  },
  formType () {
    if (Settings.findOne()) {
      // Updating existing Settings
      return 'update';
    }
    // Editing Settings
    return 'insert';
  },
  editDoc () {
    return Settings.findOne();
  },
});
