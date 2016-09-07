AutoForm.hooks({
  contactForm: {
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr('disabled', 'disabled');
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr('disabled');
    },
    onSuccess () {
      // Get translated success message
      const successMessage = TAPi18n.__('contactForm_successMessage');

      // Alert user of success
      sAlert.success(successMessage);
    },
  },
});
