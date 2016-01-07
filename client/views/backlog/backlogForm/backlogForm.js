AutoForm.hooks({
  apiBacklog: {
    beginSubmit: function () {
      // Disable form elements while submitting form
      $('#apiBacklogFormSubmit').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('#apiBacklogFormSubmit').removeAttr("disabled");
    }
  }
});

AutoForm.addHooks(['apiBacklog'], {
  // Success message
  onSuccess: function () {
    $('#apiBacklogFormModal').css('display', 'none');
    FlashMessages.sendSuccess('Thank you! Your backlog has been successfully published.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
