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
import moment from 'moment';

// APInf imports
import overviewChartsRequest from '../elasticsearch_queries/overview_charts';
import responseStatusCodesRequest from '../elasticsearch_queries/status_codes';
import totalNumbersRequest from '../elasticsearch_queries/total_numbers';

Template.dashboardView.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Init variables
  instance.elasticsearchHost = new ReactiveVar();
  instance.filteredRequestPaths = new ReactiveVar();
  instance.overviewChartResponse = new ReactiveVar();
  instance.totalNumberResponse = new ReactiveVar();
  instance.statusCodesResponse = new ReactiveVar();
  instance.groupingIds = new ReactiveVar({
    myApis: [],
    managedApis: [],
    otherApis: [],
  });

  // Get API IDs for grouping
  Meteor.call('groupingApiIds', (err, res) => {
    instance.groupingIds.set(res);
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

  // Reactive update "filters" option when Proxy Backends paths list is changed
  instance.autorun(() => {
    // Fetch proxy backends
    const proxyBackends = ProxyBackends.find().fetch();

    const filters = {
      filters: {},
    };

    // Create "filters" option for elasticsearch queries
    proxyBackends.forEach(backend => {
      const requestPath = backend.frontendPrefix();

      filters.filters[requestPath] = { prefix: { request_path: requestPath } };
    });

    // Save it in reactive variable
    instance.filteredRequestPaths.set(filters);
  });

  instance.autorun(() => {
    const elasticsearchHost = instance.elasticsearchHost.get();
    // Make sure Host exists
    if (elasticsearchHost) {
      // Get list of filtered proxy backends paths
      const filteredRequestPaths = instance.filteredRequestPaths.get();

      // Get timeframe
      const timeframe = FlowRouter.getQueryParam('timeframe');

      // Create date range parameter
      const dateRange = {
        // Plus one day to include current day in selection
        today: moment().add(1, 'days').format('YYYY-MM-DD'),
        oneTimePeriodAgo: moment().subtract(timeframe - 1, 'days').format('YYYY-MM-DD'),
        // eslint-disable-next-line no-mixed-operators
        twoTimePeriodsAgo: moment().subtract(2 * timeframe - 1, 'days').format('YYYY-MM-DD'),
      };

      // Make query object
      const overviewChartsQuery = overviewChartsRequest(filteredRequestPaths, dateRange);

      // Send request to get data for overview charts
      Meteor.call('overviewChartData', elasticsearchHost, overviewChartsQuery, (error, result) => {
        if (error) {
          throw Meteor.Error(error);
        }
        instance.overviewChartResponse.set(result);
      });

      // Make query object
      const totalNumbersQuery = totalNumbersRequest(filteredRequestPaths, dateRange);

      // Send request to get data about summary statistics numbers &
      // Parse data for Total numbers & trend blocks
      Meteor.call('totalNumbersData', elasticsearchHost, totalNumbersQuery, (error, result) => {
        if (error) {
          throw Meteor.Error(error);
        }
        instance.totalNumberResponse.set(result);
      });

      // Make query object
      const statusCodesQuery = responseStatusCodesRequest(filteredRequestPaths, dateRange);

      // Send request to get data about response status codes &
      // Parse data for Response status codes block
      Meteor.call('statusCodesData', elasticsearchHost, statusCodesQuery, (error, result) => {
        if (error) {
          throw Meteor.Error(error);
        }
        instance.statusCodesResponse.set(result);
      });
    }
  });
});

Template.dashboardView.helpers({
  grouping () {
    const instance = Template.instance();
    // Return object with IDs groups
    return instance.groupingIds.get();
  },
  overviewChartResponse () {
    const instance = Template.instance();

    return instance.overviewChartResponse.get();
  },
  totalNumberResponse () {
    const instance = Template.instance();

    return instance.totalNumberResponse.get();
  },
  statusCodesResponse () {
    const instance = Template.instance();

    return instance.statusCodesResponse.get();
  },
});
