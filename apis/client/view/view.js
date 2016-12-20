// Meteor package imports
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Counts } from 'meteor/tmeasday:publish-counts';

// Apinf imports
import { Apis } from '/apis/collection';
import { Feedback } from '/feedback/collection';
import { ApiBacklogItems } from '/backlog/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Template.viewApi.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the API Backend ID from the route
  instance.apiId = FlowRouter.getParam('_id');

  // Subscribe to a single API Backend, by ID
  instance.subscribe('apiBackend', instance.apiId);

  // Subscribe to API feedback items for this API Backend
  instance.subscribe('apiBackendFeedback', instance.apiId);

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe('apiBacklogItems', instance.apiId);

  // Subscribe to public proxy details
  instance.subscribe('proxyCount');

  // Subscribe to proxy settings for this API
  instance.subscribe('apiProxySettings', instance.apiId);

  // Subscribe to public proxy details for proxy form
  instance.subscribe('publicProxyDetails');

  // Subscribe to authorized user public details
  instance.subscribe('apiAuthorizedUsersPublicDetails', instance.apiId);

  // Subscribe to all users, returns only usernames
  instance.subscribe('allUsers');

  // Subscribe to all organizations, returns only id and name
  instance.subscribe('allOrganizationBasicDetails');
});

Template.viewApi.helpers({
  api () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

    // Get single API Backend
    const api = Apis.findOne(apiId);

    return api;
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
