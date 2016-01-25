Template.sidebar.helpers({
  userHasApis : function() {
    // get current user id
    var currentUserId = Meteor.userId();
    // count added apis
    var backendsCount  = ApiBackends.find({managerIds: currentUserId}).count();
    // return true if user has backends
    return backendsCount > 0;
  },
  apiDoc_notEmpty : function() {
    //Return true if apiDocumentation was set and false if else.
    return Settings.findOne({"apiDocumentationEditor.host": {$exists: true}})
  }
});

Template.sidebar.created = function () {
  var instance = this;
  instance.subscribe('myManagedApis');
  instance.subscribe('settings');
}
