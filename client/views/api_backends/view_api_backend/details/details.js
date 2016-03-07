Template.viewApiBackendDetails.events({
  "click #deleteModal": function() {
    var apiBackendId = this.apiBackend;
    Modal.show('deleteApiBackendConfirmation', function() {
        return ApiBackends.findOne(apiBackendId);
    });
  }
});
