AutoForm.hooks({
  contactForm: {
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

AutoForm.addHooks(['contactForm'], {
  onSuccess: function () {
    FlashMessages.sendSuccess('Thank you! Your message has been successfully sent.');
  }
});
