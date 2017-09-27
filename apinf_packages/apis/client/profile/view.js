/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';

// Collection imports
import ApiBacklogItems from '/apinf_packages/backlog/collection';
import Apis from '/apinf_packages/apis/collection';
import Feedback from '/apinf_packages/feedback/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

Template.viewApi.onCreated(function () {
   // Get reference to template instance
  const templateInstance = this;

  templateInstance.api = new ReactiveVar();

  // Using to get updated subscription
  templateInstance.autorun(() => {
    // Take slug from params
    const slug = FlowRouter.getParam('slug');
    templateInstance.subscribe('apiComposite', slug);
    // Subscribe to API and related organization;
    // Subscribe to public proxy details
    templateInstance.subscribe('proxyCount');
    // Subscribe to public proxy details for proxy form
    templateInstance.subscribe('publicProxyDetails');
    // Get single API Backend
    const api = Apis.findOne({ slug });
    if (api) {
      templateInstance.api.set(api);
    }
  });
});

Template.viewApi.helpers({
  api () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get single API Backend
    const api = templateInstance.api.get();
    // Save the API ID
    templateInstance.apiId = api._id;

    return api;
  },
  apiDoc () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get API ID
    const apiId = templateInstance.apiId;

    // Get single API Backend
    const apiDoc = ApiDocs.findOne({ apiId });

    return apiDoc;
  },
  proxyBackend () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get API ID
    const apiId = templateInstance.apiId;

    // Look for existing proxy backend document for this API
    const apiProxySettings = ProxyBackends.findOne({ apiId });

    return apiProxySettings;
  },
  backlogItems () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get API ID
    const apiId = templateInstance.apiId;

    // Fetch all backlog items for a specific API Backend
    // Sort by priority value and created date
    const backlogItems = ApiBacklogItems.find(
      { apiBackendId: apiId },
      { sort: { priority: -1, createdAt: -1 } }
    ).fetch();

    return backlogItems;
  },
  feedbackItems () {
    // Get reference to template instance
    const templateInstance = Template.instance();

    // Get API ID
    const apiId = templateInstance.apiId;

    // Fetch all feedback items for a specific API Backend
    // Sort by created date
    const feedbackItems = Feedback.find(
      { apiBackendId: apiId },
      { sort: { createdAt: -1 } }
    ).fetch();

    return feedbackItems;
  },
  proxyIsConfigured () {
    // Get count of Proxies
    const proxyCount = Counts.get('proxyCount');

    // Check that a proxy is defined
    if (proxyCount > 0) {
      // Proxy is defined
      return true;
    }
    return false;
  },
});
