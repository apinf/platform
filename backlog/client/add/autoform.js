AutoForm.hooks({
  addApiBacklogItemForm: {
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

AutoForm.addHooks(['addApiBacklogItemForm'], {
  // Success message
  onSuccess: function () {
    // Hide Add Backlog Item modal
    Modal.hide("addApiBacklogItem");
  }
});
