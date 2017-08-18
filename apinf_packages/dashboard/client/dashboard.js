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
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import _ from 'lodash';

Template.dashboard.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to proxy backends data
  instance.subscribe('proxyApis');
  // Subscribe to managed apis names
  instance.subscribe('userManagedApisName');

  // Keeps ES data for charts
  instance.chartData = new ReactiveVar();

  instance.getChartData = function (proxyData, filterParameters) {
    return new Promise((resolve, reject) => {
      Meteor.call('getElasticSearchData', proxyData, filterParameters, (err, res) => {
        if (err) reject(err);
        resolve(res.hits.hits);
      });
    });
  };

  instance.autorun(() => {
    if (instance.subscriptionsReady()) {
      // The main Elastic Search Logic

      // Get backend id from query param
      const backendParameter = FlowRouter.getQueryParam('backend');
      // Get dateTo & dateFrom from query param
      const analyticsFrom = FlowRouter.getQueryParam('fromDate');
      const analyticsTo = FlowRouter.getQueryParam('toDate');
      // Get granularity from query param
      const granularity = FlowRouter.getQueryParam('granularity');

      // Constructs object of analytics data
      const filterParameters = {
        analyticsFrom,
        analyticsTo,
        granularity,
      };

      // Make sure backend id exists
      if (backendParameter) {
        // Check of existing needed proxy data
        Meteor.call('getProxyData', backendParameter, (error, result) => {
          // if it was not error
          if (!error) {
            // Provide proxy data to elastic search
            instance.getChartData(result, filterParameters)
              .then((chartData) => {
                // Update reactive variable
                instance.chartData.set(chartData);
              })
              .catch((err) => { throw new Meteor.Error(err); });
          }
        });
      }
    }
  });
});

Template.dashboard.helpers({
  chartData () {
    const instance = Template.instance();

    return instance.chartData.get();
  },
  proxyBackends () {
    // Fetch proxy backends and sort them by name
    const proxyBackendsList = ProxyBackends.find().fetch();

    // Create a new one list
    const proxyBackends = _.map(proxyBackendsList, (backend) => {
      // Add API name
      backend.apiName = backend.apiName();

      return backend;
    });

    // Get the current language
    const language = TAPi18n.getLanguage();
    // Sort the proxy backend list by API name
    proxyBackends.sort((a, b) => {
      return a.apiName.localeCompare(b.apiName, language);
    });

    // Get the current selected backend
    const backendParameter = FlowRouter.getQueryParam('backend');
    // If query param doesn't exist and proxy backend list is ready
    if (!backendParameter && proxyBackends[0]) {
      // Modifies the current history entry instead of creating a new one
      FlowRouter.withReplaceState(() => {
        // Set the default value as first item of backend list
        FlowRouter.setQueryParams({ backend: proxyBackends[0]._id });
      });
    }

    return proxyBackends;
  },
  proxyBackendsExists () {
    // Fetch proxy backends
    return ProxyBackends.find().fetch();
  },
  managedApisCount () {
    // Return count of managed APIs
    return Apis.find().count();
  },
});
