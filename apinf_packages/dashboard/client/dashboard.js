/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.dashboardPage.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.proxiesList = new ReactiveVar();
  instance.proxyId = new ReactiveVar();

  const proxyType = 'apiUmbrella';

  Meteor.call('getProxiesList', proxyType, (error, result) => {
    instance.proxiesList.set(result);
    // Make sure Proxies list is not empty
    if (result.length > 0) {
      // Modifies the current history entry instead of creating a new one
      FlowRouter.withReplaceState(() => {
        // Set the default value as first item of proxies list
        FlowRouter.setQueryParams({ proxy: result[0]._id });
      });

      // Set the default value as first item of proxies list
      instance.proxyId.set(result[0]._id);
    }
  });

  instance.autorun(() => {
    const proxyId = instance.proxyId.get();
    // Make sure value exists
    if (proxyId) {
      // Subscribe to proxy, related backends, related APIs
      instance.subscribe('proxyById', proxyId);
    }
  });
});

Template.dashboardPage.helpers({
  proxyBackendsCount () {
    // Fetch proxy backends
    return ProxyBackends.find().count();
  },
  managedApisCount () {
    // Return count of managed APIs
    return Apis.find().count();
  },
  proxiesList () {
    const instance = Template.instance();

    // Return list of available proxies
    return instance.proxiesList.get();
  },
});

Template.dashboardPage.events({
  'change #select-proxy': (event, templateInstance) => {
    const proxyId = event.currentTarget.value;

    // Modifies the current history entry instead of creating a new one
    FlowRouter.withReplaceState(() => {
      // Update value
      FlowRouter.setQueryParams({ proxy: proxyId });
    });

    // Update value
    templateInstance.proxyId.set(proxyId);
  },
});
