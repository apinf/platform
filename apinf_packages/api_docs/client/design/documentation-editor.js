/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

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
