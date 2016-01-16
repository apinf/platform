AutoForm.hooks({
  apiBacklogForm: {
    before: {
      insert: function (backlogItem) {
        // Attach API Backend Id to backlog item schema
        backlogItem.apiBackendId = Router.current().params._id;
        return backlogItem;
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
    // Close modal window "manually" after form submit successfully
    $('#apiBacklogFormModal').modal('hide');
    // Push flash message to user
    FlashMessages.sendSuccess('Thank you! Your backlog item has been successfully published.');
  }
});

FlashMessages.configure({
  // Configuration for FlashMessages
  autoHide: true,
  hideDelay: 5000,
  autoScroll: false
});
