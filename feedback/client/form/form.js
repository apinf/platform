AutoForm.hooks({
  feedback: {
    before: {
      insert (feedback) {
        feedback.apiBackendId = Router.current().params._id;
        return feedback;
      },
    },
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr('disabled', 'disabled');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr('disabled');
    },
    onSuccess () {
      FlashMessages.sendSuccess('Thank you! Your feedback has been successfully sent.');
    },
  },
});
