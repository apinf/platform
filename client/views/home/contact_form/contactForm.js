Template.contactForm.helpers({
  contactFormSchema: function() {
    return Schemas.contact;
  }
});

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

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
