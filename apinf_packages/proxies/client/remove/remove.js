/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.removeProxy.onCreated(function () {
  const proxyId = Template.currentData().proxy._id;
  // Subscribe to proxy backends of currentProxy
  this.subscribe('proxyBackends', proxyId);
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
  'click #confirm-remove-proxy': (event) => {
    const button = event.currentTarget;

    const proxyId = Template.currentData().proxy._id;

    // Check proxyId
    if (proxyId) {
      // Disabled button while request is in process
      button.disabled = true;
      // Remove proxy and all related proxy backends configurations
      Meteor.call('removeProxy', proxyId, (err) => {
        // Display error if something went wrong
        if (err) sAlert.error(err);

        // Enabled button when request is end
        button.disabled = false;

        // Hide form
        Modal.hide('removeProxy');
      });
    } else {
      // Show alert of failed removal
      const errorMessage = TAPi18n.__('removeProxy_errorMessage');
      sAlert.error(errorMessage);
    }
  },
});
