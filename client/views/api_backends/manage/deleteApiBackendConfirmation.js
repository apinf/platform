Template.deleteApiBackendConfirmation.helpers({
  'apiBackend': function() {
    Session.set("apiBackendId", this._id);
    return ApiBackends.findOne(this._id).name;
  }
});

Template.deleteApiBackendConfirmation.events({
  'click #deleteApi': function() {
    const apiBackendId = Session.get("apiBackendId");
    ApiBackends.remove(apiBackendId);
  }  
});
