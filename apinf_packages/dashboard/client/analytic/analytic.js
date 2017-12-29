/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.apiAnalyticPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get API slug from route parameter
  const apiSlug = FlowRouter.getParam('apiSlug');

  // Subscribe to related Proxy Backend, API, Proxy instances
  instance.subscribe('proxyBackendRelatedData', apiSlug);
});

Template.apiAnalyticPage.helpers({
  proxyBackendId () {
    const proxyBackend = ProxyBackends.findOne();

    // Make sure proxy backend exists and return ID
    return proxyBackend && proxyBackend._id;
  },
});
