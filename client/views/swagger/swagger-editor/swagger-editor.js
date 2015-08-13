Template.apiDocumentationEditor.helpers({
  // Creates a variable from the
  editorUrl: function () {
    // Get the URL of the API Documentation Editor from public settings
    var apiDocumentationEditorHost = Meteor.settings.public.apiDocumentationEditor.host;

    return apiDocumentationEditorHost;
  }
});
