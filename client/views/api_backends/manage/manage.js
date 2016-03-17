Template.manageApiBackends.created = function () {
  this.subscribe('myManagedApis');
};

Template.manageApiBackends.rendered = function () {
  var myManagedApis = ApiBackends.find().fetch();

  //console.log(myManagedApis);
};

Template.manageApiBackends.helpers({
  'managedApis': function () {
    // Get the current user
    var userId = Meteor.user()._id;

    // Get API Backends managed by user (provided by subscription)
    var managedApis = ApiBackends.find({managerIds: userId});

    return managedApis;
  }
});

Template.manageApiBackends.events({
  "click #deleteModal": function() {
    // Get API backend ID from template data
    var apiBackendId = this._id;

    // Get API backend document
    const apiBackend = ApiBackends.findOne(apiBackendId);

    // Show Delete API Backend confirmation modal, for current API backend
    Modal.show('deleteApiBackendConfirmation', apiBackend);
  }
});
