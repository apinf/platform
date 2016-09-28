AutoForm.hooks({
  editBacklogItemForm: {
    // Success message
    onSuccess () {
      // Hide Edit Backlog Item modal
      Modal.hide("editBacklogItem");
    }
  }
});
