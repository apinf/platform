Template.sidebar.helpers({
  userHasApis : function() {
    // get current user id
    var currentUserId = Meteor.userId();
    // count added apis
    var backendsCount  = ApiBackends.find({managerIds: currentUserId}).count();
    // return true if user has backends
    return backendsCount > 0;
  },
  apiDocumentationEditorIsEnabled : function() {
    // Saving the fields apiDocumentationEditor.enabled into the variable
    // settings.
    var settings = Settings.findOne({},{"apiDocumentationEditor.enabled": 1, _id:0})
    // Accessing the value of enabled in the apiDocumentationEditor Object
    return settings.apiDocumentationEditor.enabled
  }
});

Template.sidebar.created = function () {
  var instance = this;
  instance.subscribe('myManagedApis');
  instance.subscribe("singleSetting", "apiDocumentationEditor");
}
