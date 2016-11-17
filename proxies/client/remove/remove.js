import { Template } from 'meteor/templating';
import { ProxyBackends } from '/proxy_backends/collection';
import { Proxies } from '../../collection';

Template.removeProxy.onCreated(function () {
  const proxyId = Template.currentData().proxy._id;
  // Subscribe to proxy backends of currentProxy
  this.subscribe('proxyApis');
});


Template.removeProxy.helpers({
  connectedProxyBackends () {
    let connectedProxyBackends = 0;
    // Get proxyId from template data
    const proxyId = Template.currentData().proxy._id;

    // Check proxyId
    if (proxyId) {
      // Get count of connected proxy backends
      connectedProxyBackends = ProxyBackends.find({ proxyId }).count();
    }
    // Return count
    return connectedProxyBackends;
  },
});

Template.removeProxy.events({
  'click #confirm-remove-proxy': function (event, instance) {
    const proxyId = Template.currentData().proxy._id;

    // Check proxyId
    if (proxyId) {
      Proxies.remove(proxyId);
    }

    Modal.hide('removeProxy');
  },
});
