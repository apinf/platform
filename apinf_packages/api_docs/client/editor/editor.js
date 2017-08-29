/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.openApiEditor.onRendered(function () {
  const designer = document.getElementById('designer-iframe').contentWindow;

  // Get URL of document
  const documentation = this.data.api.documentationUrl();

  designer.postMessage({
    noDelete: true,
    swagger: documentation,
  }, '*');
});
