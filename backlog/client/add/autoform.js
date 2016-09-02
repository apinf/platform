AutoForm.hooks({
  addApiBacklogItemForm: {
    before: {
      insert (backlogItem) {
        // Attach API Backend Id to backlog item schema
        backlogItem.apiBackendId = Router.current().params._id;
        return backlogItem;
      }
    },
    beginSubmit () {
      // Disable form elements while submitting form
      $('[data-schema-key],button').attr("disabled", "disabled");
    },
    endSubmit () {
      // Enable form elements after form submission
      $('[data-schema-key],button').removeAttr("disabled");
    },
    onSuccess () {
      // Hide Add Backlog Item modal
      Modal.hide("addApiBacklogItem");
    }
  }
});
