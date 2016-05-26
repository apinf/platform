Template.documentation.events({
  'click #manage-api-documentation' () {
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { apiBackend })
  }
});
