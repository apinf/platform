/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.apiAnalyticPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.proxyBackendId = FlowRouter.getParam('proxyBackendId');

  // Subscribe to related Proxy Backend, API, Proxy instances
  instance.subscribe('proxyBackendRelatedData', instance.proxyBackendId);
});

Template.apiAnalyticPage.helpers({
  proxyBackendId () {
    const instance = Template.instance();

    return instance.proxyBackendId;
  },
});
