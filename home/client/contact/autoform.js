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
  },
});

AutoForm.addHooks(['contactForm'], {
  onSuccess () {
    FlashMessages.sendSuccess('Thank you! Your message has been successfully sent.');
  },
});
