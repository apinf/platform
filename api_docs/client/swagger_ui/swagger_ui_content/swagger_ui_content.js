/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

Template.swaggerUiContent.onRendered(function () {
  const api = this.data.api;

  /* eslint-disable */
  // Disable eslint here to supress messages
  // about SwaggerUIBundle, SwaggerUIStandalonePreset, etc.
  // since we can't figure out how to import them directly
  // TODO: see if we can fix ESLint errors here properly, without suppressing
  const ui = SwaggerUIBundle({
    url: api.documentationUrl(),
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });
  /* eslint-enable */
});
