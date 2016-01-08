AutoForm.hooks({
  apiBacklogForm: {
    before: {
      insert: function (backlog) {
        backlog.apiBackendId = Router.current().params._id;
        return backlog;
      }
    },
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

AutoForm.addHooks(['apiBacklogForm'], {
  // Success message
  onSuccess: function () {
    FlashMessages.sendSuccess('Thank you! Your backlog has been successfully published.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
