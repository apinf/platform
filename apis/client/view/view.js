import { Apis } from '/apis/collection';
import { ApiBacklogItems } from '/backlog/collection';
import { Proxies } from '/proxies/collection';
import { ProxyBackends } from '/proxy_backends/collection';

Template.viewApiBackend.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the API Backend ID from the route
  instance.apiId = Router.current().params._id;

  // Subscribe to a single API Backend, by ID
  instance.subscribe('apiBackend', instance.apiId);

  // Subscribe to API Backlog items for this API Backend
  instance.subscribe('apiBacklogItems', instance.apiId);

  // Subscribe to public proxy details
  instance.subscribe('publicProxyDetails');

  // Subscribe to proxy settings for this API
  instance.subscribe('apiProxySettings', instance.apiId);
});

Template.viewApiBackend.helpers({
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
    console.log(apiProxySettings);
    return apiProxySettings;
  },
  backlogItems () {
    // Get reference to template instance
    const instance = Template.instance();

    // Get API ID
    const apiId = instance.apiId;

    // Fetch all backlog items for a specific API Backend
    // Sort by priority value and created date
    const backlogItems = ApiBacklogItems.find({ apiId }, { sort: { priority: -1, createdAt: -1 } }).fetch();

    return backlogItems;
  },
  proxyIsConfigured () {
    // Check if one or more proxy has been configured
    let proxyIsConfigured;

    const proxyCount = Proxies.find().count();

    if (proxyCount > 0) {
      proxyIsConfigured = true;
    } else {
      proxyIsConfigured = false;
    }

    return proxyIsConfigured;
  },
});
