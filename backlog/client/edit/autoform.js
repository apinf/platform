AutoForm.addHooks(['editBacklogItemForm'], {
  // Success message
  onSuccess: function () {
    // Hide Edit Backlog Item modal
    Modal.hide("editBacklogItem");
  }
});
