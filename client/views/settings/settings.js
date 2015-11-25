Template.settings.created = function () {
  // Subscription to feedback collection
  this.subscribe('settings');
};

Template.settings.helpers({
  settings: function () {
    return Settings.findOne();
  }
});

AutoForm.hooks({
  settings: {
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    }
  }
});

AutoForm.addHooks(['settings'], {
  onSuccess: function () {
    FlashMessages.sendSuccess('Settings saved.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
