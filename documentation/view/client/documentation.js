Template.documentation.events({
  'click #manage-api-documentation' (event, instance) {
    // Get reference to API backend
    const apiBackend = instance.data.apiBackend
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { apiBackend })
  }
});


Template.documentation.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to organization logo collection
  instance.subscribe('apiDocumentation');
});

Template.documentation.helpers({
  apiDocumentationObject: function () {
    // Get reference to template instance
    const instance = this;

    // Get API Documentation ID
    const apiDocumentationId = instance.apiBackend.documentationFileId;

    // Find FS.collection object by API Documentation ID
    const apiDocumentationObject = ApiDocumentation.findOne(apiDocumentationId);

    return apiDocumentationObject;
  }
});
