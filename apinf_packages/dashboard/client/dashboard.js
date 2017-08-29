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

  // Get proxy ID value from query params
  const proxyId = FlowRouter.getQueryParam('proxy_id');
  // Set type of proxy is API Umbrella
  const proxyType = 'apiUmbrella';

  Meteor.call('getProxiesList', proxyType, (error, result) => {
    // if proxy id value isn't available from Query param then
    // Set the first item of list as the default value
    // Make sure Proxies list is not empty
    if (!proxyId && result.length > 0) {
      // Modifies the current history entry instead of creating a new one
      FlowRouter.withReplaceState(() => {
        // Set the default value for query parameter
        FlowRouter.setQueryParams({ proxy_id: result[0]._id });
      });
    }

    // Save result to template instance
    instance.proxiesList.set(result);
  });

  instance.autorun(() => {
    const currentProxyId = FlowRouter.getQueryParam('proxy_id');
    // Make sure value exists
    if (currentProxyId) {
      // Subscribe to proxy, related backends, related APIs
      instance.subscribe('proxyById', currentProxyId);
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
