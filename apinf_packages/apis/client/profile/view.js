/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import ApiBacklogItems from '/apinf_packages/backlog/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';
import Feedback from '/apinf_packages/feedback/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Settings from '/apinf_packages/settings/collection';

Template.viewApi.onCreated(function () {
  // Get reference to template instance
  const templateInstance = this;

  templateInstance.api = new ReactiveVar();

  // Subscribe to public proxy details
  templateInstance.subscribe('proxyCount');
  // Subscribe to public proxy details for proxy form
  templateInstance.subscribe('publicProxyDetails');

  // Using to get updated subscription
  templateInstance.autorun(() => {
    // Take slug from params
    const slug = FlowRouter.getParam('slug');

    if (slug) {
      // Subscribe to API and related organization
      templateInstance.subscribe('apiComposite', slug);
    }

    // Get single API Backend
    const api = Apis.findOne({ slug });

    if (api) {
      // Store it in reactive variable
      templateInstance.api.set(api);

      // Get Branding configuration
      const branding = Branding.findOne();

      // Check if Branding config and siteTitle are available
      if (branding && branding.siteTitle) {
        // Set a browser tab name
        DocHead.setTitle(`${branding.siteTitle} - ${api.name}`);
      }
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
  developmentFeatures () {
    // Get settings
    const settings = Settings.findOne();

    // Make sure that Settings exist
    if (settings) {
      return settings.developmentFeatures;
    }
  },
});
