Template.viewApiBackendDetails.events({
  // event handler to execute when delete API button is clicked
  "click #deleteModal": function() {
    var apiBackendId = this.apiBackend;
    /* As information to the delete modal, pass in the API backend document.
    This is needed so that the API name can be shown in the dialog, 
    as well for other information needed for API removal, such as ID*/ 
    Modal.show('deleteApiBackendConfirmation', function() {
        return ApiBackends.findOne(apiBackendId);
    });
  }
});
