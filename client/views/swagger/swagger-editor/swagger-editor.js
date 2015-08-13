Template.editor.helpers({
  // Creates a variable from the
  editorUrl: function () {
    // Get the URL of the API Documentation Editor from public settings
    var apiDocumentationEditorUrl = Meteor.settings.public.apiDocumentationEditor.host;
    
    return apiDocumentationEditorHost;
  }
});
