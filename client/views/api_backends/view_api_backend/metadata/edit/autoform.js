AutoForm.addHooks("editApiMetadataForm", {
  before: {
    "insert": function (metadata) {
      // Get reference to Router
      let router = Router.current();

      // Get API Backend ID, from Router
      let apiBackendId = router.params._id;

      // Set the API Backend ID property of the metadata document
      metadata.apiBackendId = apiBackendId;

      return metadata;
    }
  },
  "onSuccess": function () {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  }
});

AutoForm.addHooks("updateApiMetadataForm", {
  "onSuccess": function () {
    // Close modal dialogue
    $('#apiMetadataModal').modal('hide');
  }
});
