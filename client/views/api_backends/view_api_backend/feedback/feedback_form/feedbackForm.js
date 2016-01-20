AutoForm.hooks({
  feedback: {
    before: {
      insert: function (feedback) {
        feedback.apiBackendId = Router.current().params._id;
        return feedback;
      }
    },
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

AutoForm.addHooks(['feedback'], {
  // Success message
  onSuccess: function () {
    FlashMessages.sendSuccess('Thank you! Your feedback has been successfully sent.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
