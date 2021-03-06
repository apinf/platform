/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Template.dashboardToolbar.helpers({
  selectedProxy () {
    const proxyId = FlowRouter.getQueryParam('proxy_id');

    // Select this option if it is equal with query param value
    return proxyId === this._id ? 'selected' : '';
  },
  managedOneApi () {
    return ProxyBackends.find().count() === 1;
  },
  managedApisCount () {
    const apis = Apis.find();

    // Return count of managed APIs
    if (apis) {
      return apis.count();
    }
    return false;
  },
});

Template.dashboardToolbar.events({
  'change .toolbar-select': (event) => {
    // Placeholder
    const queryParams = {};

    // Get name & value of select item
    // These parameters are name and value of query parameter related
    const paramName = event.currentTarget.name;
    queryParams[paramName] = event.currentTarget.value;

    // Modifies the current history entry instead of creating a new one
    FlowRouter.withReplaceState(() => {
      // Update value
      FlowRouter.setQueryParams(queryParams);
    });
  },
});
