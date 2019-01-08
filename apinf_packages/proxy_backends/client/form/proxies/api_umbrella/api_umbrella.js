/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import URI from 'urijs';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

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
    const apiId = this.api._id;
    const proxyBackend = ProxyBackends.findOne({ apiId });

    if (proxyBackend && proxyBackend.apiUmbrella && proxyBackend.apiUmbrella.servers[0].port) {
      return proxyBackend.apiUmbrella.servers[0].port;
    }

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
  supportsGraphql () {
    const settings = Settings.findOne();
    // Boolean value of "supportsGraphql" field
    return settings ? settings.supportsGraphql : false;
  },
  basePathsGiven () {
    // Get proxyBackend information
    const apiId = this.api._id;
    const proxyBackend = ProxyBackends.findOne({ apiId });
    if (proxyBackend &&
        proxyBackend.apiUmbrella &&
        proxyBackend.apiUmbrella.url_matches[0].frontend_prefix &&
        proxyBackend.apiUmbrella.url_matches[0].backend_prefix) {
      return '#19B934';
    }

    return '#ccc';
  },
});
