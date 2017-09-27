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
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import _ from 'lodash';

// APInf imports
import queryForDashboardPage from './query';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  instance.groupingIds = {
    myApis: [],
    managedApis: [],
    otherApis: [],
  };

  // Init variables
  instance.chartData = new ReactiveVar();
  instance.error = new ReactiveVar();
  instance.elasticsearchHost = new ReactiveVar();
  instance.proxyBackendPaths = new ReactiveVar();

  // Get API IDs for grouping
  Meteor.call('groupingApiIds', (err, res) => {
    instance.groupingIds = res;
  });

  // Reactive update Elasticsearch host
  instance.autorun(() => {
    // Get proxy
    const proxy = Proxies.findOne();

    // Get relevant Elasticsearch host
    const host = _.get(proxy, 'apiUmbrella.elasticsearch', '');

    // Save it in reactive variable
    instance.elasticsearchHost.set(host);
  });

  // Reactive update Proxy Backends paths list
  instance.autorun(() => {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    // Create a list with requested paths
    const paths = _.map(proxyBackends, (backend) => {
      const requestPath = backend.apiUmbrella.url_matches[0].frontend_prefix;
      return {
        wildcard: {
          request_path: {
            // Add '*' to partially match the url
            // Remove the last slash
            value: `${requestPath.slice(0, -1)}*`,
          },
        },
      };
    });

    // Save it in reactive variable
    instance.proxyBackendPaths.set(paths);
  });

  instance.autorun(() => {
    const elasticsearchHost = instance.elasticsearchHost.get();
    // Make sure Host exists
    if (elasticsearchHost) {
      // Get list of proxy backends paths
      const proxyBackendPaths = instance.proxyBackendPaths.get();
      // Get timeframe
      const timeframe = FlowRouter.getQueryParam('timeframe');

      // Make query object
      const queryParams = queryForDashboardPage(proxyBackendPaths, timeframe);

      // Get chart data for dashboard
      Meteor.call('dashboardChartData', elasticsearchHost, queryParams, (error, result) => {
        if (error) {
          instance.error.set(error);
          throw Meteor.Error(error);
        }
        // Update chart data reactive variable with result
        instance.chartData.set(result);
      });
    }
  });
});

Template.dashboardView.helpers({
  chartData () {
    // Get reference to template instance
    const instance = Template.instance();

    // Return data for charts
    return instance.chartData.get();
  },
  fetchingData () {
    const instance = Template.instance();
    // Return status about error or chart data
    return instance.chartData.get() || instance.error.get();
  },
  error () {
    const instance = Template.instance();
    // Return value of error
    return instance.error.get();
  },
  grouping () {
    const instance = Template.instance();
    // Return object with IDs groups
    return instance.groupingIds;
  },
});
