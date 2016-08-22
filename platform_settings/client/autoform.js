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
    // Call method to update Meteor.settings
    Meteor.call('updateMeteorSettings');
    FlashMessages.sendSuccess('Settings saved.');
    // Check if we can create ApiUmbrellaWeb object
    try {
      Meteor.call("createApiUmbrellaWeb");
      Meteor.call("syncApiUmbrellaUsers");
      Meteor.call("syncApiBackends");
    }
    // otherwise show an error
    catch (error) {
      console.log(error);
    }
  }
});
