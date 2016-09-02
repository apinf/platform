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

AutoForm.hooks({
  settings: {
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr('disabled', 'disabled');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr('disabled');
    },
  },
});

AutoForm.addHooks(['settings'], {
  onSuccess () {
    // Call method to update Meteor.settings
    Meteor.call('updateMeteorSettings');
    FlashMessages.sendSuccess('Settings saved.');
    // Check if we can create ApiUmbrellaWeb object
    try {
      Meteor.call('createApiUmbrellaWeb');
      Meteor.call('syncApiUmbrellaUsers');
      Meteor.call('syncApiBackends');
    }
    // otherwise show an error
    catch (error) {
      console.log(error);
    }
  },
});

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false,
});
