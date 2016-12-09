import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

import { Apis } from '/apis/collection';
import { ProxyBackends } from '/proxy_backends/collection';


Template.dashboard.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Subscribe to proxyApis publicaton
  instance.subscribe('proxyApis');
  // Subscribe to managed apis
  instance.subscribe('myManagedApis');

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
      // Cleanup previous message if one exists
      $('.charts-holder>#no-chart-data-placeholder').remove();

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
            .catch(err => console.error(err));
        }
      });
    }
  });
});

Template.dashboard.helpers({
  chartData () {
    const instance = Template.instance();

    return instance.chartData.get();
  },
  proxyBackends () {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    // Get the current selected backend
    const backendParameter = FlowRouter.getQueryParam('backend');
    // If query param doesn't exist and proxy backend list is ready
    if (!backendParameter && proxyBackends[0]) {
      // Set the default value as first item of backend list
      FlowRouter.setQueryParams({ backend: proxyBackends[0]._id });
    }

    return proxyBackends;
  },
  proxyBackendsExists () {
    // Fetch proxy backends
    return ProxyBackends.find().fetch();
  },
  managedApis () {
    // Check if user is administrator
    const userIsAdmin = Roles.userIsInRole(Meteor.userId(), ['admin']);

    // Get count of managed apis
    const apisCount = Apis.find().count();

    // Page can be seen by administrator or user with apis
    return userIsAdmin || apisCount > 0;
  },
});
