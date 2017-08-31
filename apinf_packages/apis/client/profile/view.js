/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Counts } from 'meteor/tmeasday:publish-counts';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import ApiBacklogItems from '/apinf_packages/backlog/collection';
import Apis from '/apinf_packages/apis/collection';
import Feedback from '/apinf_packages/feedback/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import ApiDocs from '/apinf_packages/api_docs/collection';

Template.viewApi.onCreated(function () {
   // Get reference to template instance
  const instance = this;
  const templateInstance = this;

  // Reactive variable to hold API document
  instance.api = new ReactiveVar();

  templateInstance.autorun(()=>{

    const slug = FlowRouter.getParam('slug');
    instance.slug = slug;
    
    // Subscribe to API and related organization
    instance.subscribe('apiComposite', instance.slug);

    // Subscribe to public proxy details
    instance.subscribe('proxyCount');

    // Subscribe to public proxy details for proxy form
    instance.subscribe('publicProxyDetails');

    if(instance.subscriptionsReady()){
      // Get single API Backend
      const api = Apis.findOne({ slug });     
      if (api) {
        instance.api.set(api);
      }
    }
  });
});

Template.viewApi.helpers({
  api () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get single API Backend
    const api = instance.api.get();
    // Save the API ID
    instance.apiId = api._id;

    return api;
  },
  apiDoc () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

    // Get single API Backend
    const apiDoc = ApiDocs.findOne({ apiId });

    return apiDoc;
  },
  proxyBackend () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

    // Look for existing proxy backend document for this API
    const apiProxySettings = ProxyBackends.findOne({ apiId });

    return apiProxySettings;
  },
  backlogItems () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

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
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

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
