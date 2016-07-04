Template.contactForm.helpers({
  contactFormSchema: function() {
    return Schemas.contact;
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages.
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
