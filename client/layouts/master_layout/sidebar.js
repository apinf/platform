Template.sidebar.helpers({
  haveApis : function() {
    // get current user id
    var currentUserId = Meteor.userId();
    // count added apis
    var backendsCount  = ApiBackends.find({managerIds: currentUserId}).count();
    // return true if user has backends
    return backendsCount > 0;
  }
});

Template.sidebar.created = function () {
  var instance = this;
  instance.subscribe('myManagedApis');
}
