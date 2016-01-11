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
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit: function () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    }
  }
});

AutoForm.addHooks(['apiBacklogForm'], {
  // Success message
  onSuccess: function () {
    $('#apiBacklogFormModal').modal('hide');
    FlashMessages.sendSuccess('Thank you! Your backlog has been successfully published.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
