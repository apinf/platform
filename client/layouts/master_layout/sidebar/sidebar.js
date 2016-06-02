Template.sidebar.onCreated(function () {
  var instance = this;
  instance.subscribe("singleSetting", "apiDocumentationEditor");
});

Template.sidebar.helpers({
  apiDocumentationEditorIsEnabled : function() {
    // Saving the fields apiDocumentationEditor.enabled into the variable
    // settings.
    var settings = Settings.findOne({},{"apiDocumentationEditor.enabled": 1, _id:0})
    // Accessing the value of enabled in the apiDocumentationEditor Object
    if(settings && settings.apiDocumentationEditor) {
      return settings.apiDocumentationEditor.enabled
    }
  }
});
