/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { Session } from 'meteor/session';

import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import URI from 'urijs';

// Collection imports
import Settings from '/apinf_packages/settings/collection';

// eslint-disable-next-line prefer-arrow-callback
Template.proxy42ProxyForm.onRendered(function () {
  const instance = this;
  console.log('renderöinti, instance=', instance);
  // Initiate as not Proxy 42
  Session.set('proxy42Backend', false);

  const apiId = instance.data.api._id;
  console.log('api id=', apiId);
  // Return API Proxy's URL, if it exists
  const proxyBackend = ProxyBackends.findOne({ apiId });
  console.log('proxyBackend=', proxyBackend);

  // Get proxy parameters from network in case API is connected to a Proxy 42
  if (proxyBackend && proxyBackend.type === 'proxy42') {
    Meteor.call('getBackendDataFromProxy42', (error, result) => {
      if (result) {
        Session.set('proxy42Backend', result.proxydata);
      }
      if (error) {
        // Data fetch failed
        sAlert.error(error, { timeout: 'none' });
      }
    });
  }
});










Template.proxy42ProxyForm.helpers({
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
});
