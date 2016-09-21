import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { Apis } from '/apis/collection';
import { ApiBacklogItems } from '/backlog/collection';
import { Proxies } from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Template.viewApi.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the API Backend ID from the route
  instance.apiId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  instance.subscribe('apiBackend', instance.apiId);

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe('apiBacklogItems', instance.apiId);

  // Subscribe to public proxy details
  instance.subscribe('proxyCount');

  // Subscribe to proxy settings for this API
  instance.subscribe('apiProxySettings', instance.apiId);

  // Subscribe to public proxy details for relevant Proxy
  instance.subscribe('publicProxyDetails');
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
  proxyIsConfigured () {
    // Get count of Proxies
    const proxyCount = Counts.get('proxyCount');

    // Check that a proxy is defined
    if (proxyCount > 0) {
      // Proxy is defined
      return true;
    }
  },
});
