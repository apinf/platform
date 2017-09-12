/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// APInf imports
import {
  arrowDirection,
  percentageValue,
  calculateTrend,
} from '/apinf_packages/dashboard/client/trend_helpers';

Template.dashboardSummaryStatistic.onCreated(function () {
  // Dictionary of Flags about display/not the overview part for current item
  const instance = this;

  // Dictionary of Flags about display/not the overview part for current item
  instance.displayOverview = new ReactiveDict();
  instance.proxyBackendsWithMetric = {};

  instance.autorun(() => {
    // Update list
    instance.proxyBackendsWithMetric = {};
    // Update list of proxy backends
    instance.proxyBackends = ProxyBackends.find().fetch();

    // Get actual elasticsearch data
    const elasticsearchData = Template.currentData().elasticsearchData;

    // Get bucket of aggregated data
    const buckets = elasticsearchData.aggregations.group_by_request_path.buckets;
    // Prepare dataset for summary statistic
    instance.aggregatedData = buckets.map(value => {
      const currentPeriodData = value.group_by_interval.buckets.currentPeriod;

      // Get the statistic for current period
      const requestNumber = currentPeriodData.doc_count;
      const responseTime = parseInt(currentPeriodData.response_time.values['50.0'], 10) || 0;
      const uniqueUsers = currentPeriodData.unique_users.buckets.length;
      const successCallsCount = currentPeriodData.success_status.buckets.success.doc_count;
      const errorCallsCount = currentPeriodData.success_status.buckets.error.doc_count;

      const previousPeriodData = value.group_by_interval.buckets.previousPeriod;
      const previousResponseTime = previousPeriodData.response_time.values['50.0'];
      const previousUniqueUsers = previousPeriodData.unique_users.buckets.length;

      // Get the statistics comparing between previous and current periods
      const compareRequests = calculateTrend(previousPeriodData.doc_count, requestNumber);
      const compareResponse = calculateTrend(parseInt(previousResponseTime, 10), responseTime);
      const compareUsers = calculateTrend(previousUniqueUsers, uniqueUsers);

      // Get value to display
      return {
        requestPath: value.key,
        requestNumber,
        responseTime,
        uniqueUsers,
        successCallsCount,
        errorCallsCount,
        requestOverTime: currentPeriodData.requests_over_time.buckets,
        compareRequests,
        compareResponse,
        compareUsers,
      };
    });

    instance.proxyBackends.forEach(backend => {
      const proxyBackendPath = backend.frontendPrefix();

      // Create a list of proxy backends with metric for current timeframe
      instance.aggregatedData.forEach(dataset => {
        const path = dataset.requestPath;

        // Using indexOf to check when frontend prefix and request_path differ in a last slash
        const theSamePaths = proxyBackendPath.indexOf(path);
        // If paths are equal or differ in a last slash
        if (theSamePaths === 0) {
          // Save it
          instance.proxyBackendsWithMetric[proxyBackendPath] = dataset;
          // Add info about API name & id of proxy backend
          instance.proxyBackendsWithMetric[proxyBackendPath].apiName = backend.apiName();
          instance.proxyBackendsWithMetric[proxyBackendPath].proxyBackendId = backend._id;
        }
      });
    });
  });
});

Template.dashboardSummaryStatistic.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  textColor (parameter) {
    let textColor;
    const direction = arrowDirection(parameter, this);

    // Green color for text -  percentage value near arrow
    if (direction === 'arrow-up' || direction === 'arrow-down_time') {
      textColor = 'text-success';
    }

    // Red color for text - percentage value near arrow
    if (direction === 'arrow-down' || direction === 'arrow-up_time') {
      textColor = 'text-danger';
    }

    return textColor;
  },
  displayOverview (parameter) {
    const instance = Template.instance();

    return instance.displayOverview.get(parameter);
  },
  proxyBackends () {
    const instance = Template.instance();

    // Get the current language
    const language = TAPi18n.getLanguage();

    // Sort by name
    return instance.proxyBackends.sort((a, b) => {
      return a.apiName().localeCompare(b.apiName(), language);
    });
  },
  bucket (proxyBackendPath) {
    const instance = Template.instance();

    console.log(instance.proxyBackendsWithMetric[proxyBackendPath]);
    return instance.proxyBackendsWithMetric[proxyBackendPath];
  },
});

Template.dashboardSummaryStatistic.events({
  'click [data-id]': (event, templateInstance) => {
    const target = event.currentTarget;

    // Get status of specified Overview template (shown or not)
    const display = templateInstance.displayOverview.get(target.dataset.id);

    // Inverse the value
    templateInstance.displayOverview.set(target.dataset.id, !display);

    // Display or not the box-shadow for table line
    target.classList.toggle('open');
  },
});
