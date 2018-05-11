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

  instance.lastUpdateTime = new ReactiveVar();

  // Get ID of current proxy backend
  const proxyBackendId = instance.data.proxyBackendId;

  // Get instance of Proxy Backend
  const proxyBackend = ProxyBackends.findOne(proxyBackendId);

  // Get API slug from route parameter
  const apiSlug = FlowRouter.getParam('apiSlug');

  // Subscribe to related Proxy Backend, API, Proxy instances
  instance.subscribe('proxyBackendRelatedData', apiSlug);

  // make sure proxy backend exists and
  // Get IDs of relevant API and Proxy
  instance.apiId = proxyBackend && proxyBackend.apiId;
  instance.proxyId = proxyBackend && proxyBackend.proxyId;

  Meteor.call('lastUpdateTime', { proxyBackendId }, (error, result) => {
    // Save value
    instance.lastUpdateTime.set(result);
  });
});

Template.apiAnalyticPage.helpers({
  lastUpdateTime () {
    const instance = Template.instance();

    return instance.lastUpdateTime.get();
  },
  displayLastUpdateTime () {
    const timeframe = FlowRouter.getQueryParam('timeframe');
    // Not display info about Last update if selected "Yesterday" or Today
    return timeframe !== '48' && timeframe !== '12';
  },
});
