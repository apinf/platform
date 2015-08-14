Template.apiBackendsManage.created = function () {
  this.subscribe('myManagedApis');
};

Template.apiBackendsManage.rendered = function () {
  var myManagedApis = ApiBackends.find().fetch();

  //console.log(myManagedApis);
};

Template.apiBackendsManage.helpers({
  'managedApis': function () {
    // Get the current user
    var userId = Meteor.user()._id;

    // Get API Backends managed by user (provided by subscription)
    var managedApis = ApiBackends.find({managerIds: userId});

    return managedApis;
  }
});
