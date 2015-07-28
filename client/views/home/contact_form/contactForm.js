Template.contactForm.helpers({
  contactFormSchema: function() {
    return Schema.contact;
  }
});

AutoForm.hooks({
  contactForm: {
    beginSubmit: function () {
      // disable form elements while submitting form
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    }
  }
});
