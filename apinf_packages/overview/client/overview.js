/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { DocHead } from 'meteor/kadira:dochead';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Branding from '/apinf_packages/branding/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.overview.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.searchValue = new ReactiveVar();

  instance.autorun(() => {
    // Get Branding collection content
    const branding = Branding.findOne();
    // Check if Branding collection and siteTitle are available
    if (branding && branding.siteTitle) {
      // Set the page title
      const pageTitle = TAPi18n.__('dashboardPage_title_dashboard');
      DocHead.setTitle(`${branding.siteTitle} - ${pageTitle}`);
    }
  });

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
      // Modify the current history entry instead of creating a new one
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

Template.overview.helpers({
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
  managedOneApi () {
    return ProxyBackends.find().count() === 1;
  },
  proxyBackendId () {
    return ProxyBackends.findOne()._id;
  },
  searchValue () {
    return Template.instance().searchValue.get();
  },
});

Template.overview.events({
  'keyup #search-box': (event, templateInstance) => {
    const apiName = event.currentTarget.value;
    templateInstance.searchValue.set(apiName);
  },
});
