// Collection imports
import Settings from '/settings/collection';

Template.apiDocumentationEditor.onCreated(function () {
  const instance = this;
  // Subscribe to documentation editor settings
  instance.subscribe('singleSetting', 'apiDocumentationEditor');
});

Template.apiDocumentationEditor.helpers({
  // Creates a variable from the
  editorUrl () {
    // Get settings
    const settings = Settings.findOne();

    // Check settings exists, editor is enabled and host setting exists
    if (settings &&
        settings.apiDocumentationEditor.enabled &&
        settings.apiDocumentationEditor.host) {
      // Return the URL of the API Documentation Editor from Settings collection
      return settings.apiDocumentationEditor.host;
    }

    // Otherwise return false
    return false;
  },
});
