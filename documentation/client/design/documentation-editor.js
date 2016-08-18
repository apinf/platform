Template.apiDocumentationEditor.onCreated(function () {
  const instance = this;
  // Subscribe to documentation editor settings
  instance.subscribe('singleSetting', 'apiDocumentationEditor');
});

Template.apiDocumentationEditor.helpers({
  // Creates a variable from the
  editorUrl: function () {
    // Get settings
    const settings = Settings.findOne();

    // Check settings exists, editor is enabled and host setting exists
    if(settings && settings.apiDocumentationEditor.enabled && settings.apiDocumentationEditor.host) {
      // Return the URL of the API Documentation Editor from Settings collection
      return settings.apiDocumentationEditor.host;
    } else {
      // Otherwise return false
      return false;
    }
  }
});
