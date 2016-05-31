Template.documentation.onCreated(function(){
  
});

Template.documentation.events({
  'click #manage-api-documentation' (event, instance) {
    // Get reference to API backend
    const apiBackend = instance.data.apiBackend
    // Show the manage API documentation form
    Modal.show('manageApiDocumentationModal', { apiBackend })
  }
});
