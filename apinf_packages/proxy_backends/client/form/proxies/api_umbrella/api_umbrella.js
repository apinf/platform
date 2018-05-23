/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Npm packages imports
import URI from 'urijs';

Template.apiUmbrellaProxyForm.helpers({
  apiHost () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    return apiUrl.host();
  },
  apiPortHelper () {
    // Get API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    const protocol = apiUrl.protocol();

    // Common default ports for HTTP/HTTPS
    if (protocol === 'https') {
      return 443;
    }

    if (protocol === 'http') {
      return 80;
    }

    return '';
  },
  apiUrlProtocol () {
    // Get the API information
    const api = this.api;

    // Construct URL object for API URL
    const apiUrl = new URI(api.url);

    // Return the API URL protocol
    return apiUrl.protocol();
  },
  autoProxyUrl () {

    const api = this.api;

    const apiName = api.name;

    const autoProxyUrl = '/' + apiName + '-' + 'url' + '/';

    return autoProxyUrl;
  },
});
