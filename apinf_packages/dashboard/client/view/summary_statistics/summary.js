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
// eslint-disable-next-line max-len
import { arrowDirection, percentageValue, calculateTrend } from '/apinf_packages/dashboard/client/compare_indicating';

Template.dashboardSummaryStatistic.onCreated(function () {
  // Dictionary of Flags about display/not the overview part for current item
  this.displayOverview = new ReactiveDict();
});

Template.dashboardSummaryStatistic.helpers({
  buckets () {
    // Get the current language
    const language = TAPi18n.getLanguage();

    // Get ES data
    const elasticsearchData = Template.currentData().elasticsearchData;

    // Get bucket of aggregated data
    const buckets = elasticsearchData.aggregations.group_by_request_path.buckets;

    return buckets.map(value => {
      // Get the proxy backend instance with equal frontend_prefix as request_path
      const proxyBackend = ProxyBackends.findOne({
        'apiUmbrella.url_matches': { $elemMatch: { frontend_prefix: value.key } },
      });

      if (proxyBackend) {
        const currentPeriodBucket = value.group_by_interval.buckets.currentPeriod;
        const previousPeriodBucket = value.group_by_interval.buckets.previousPeriod;

        // Get the statistic for current period
        const requestNumber = currentPeriodBucket.doc_count;
        const responseTime = parseInt(currentPeriodBucket.response_time.values['95.0'], 10) || 0;
        const uniqueUsers = currentPeriodBucket.unique_users.buckets.length;
        const successCallsCount = currentPeriodBucket.success_status.buckets.success.doc_count;
        const errorCallsCount = currentPeriodBucket.success_status.buckets.error.doc_count;

        // Get the statistics comparing between previous and current periods
        const compareRequests = calculateTrend(previousPeriodBucket.doc_count, requestNumber);
        const compareResponse = calculateTrend(
          parseInt(previousPeriodBucket.response_time.values['95.0'], 10), responseTime
        );
        const compareUsers = calculateTrend(
          previousPeriodBucket.unique_users.buckets.length, uniqueUsers
        );

        // Dictionary of Flags about display/not the overview part for current item
        // By default don't display overview template for any proxy backend
        Template.instance().displayOverview.set(proxyBackend._id, false);

        // Get value to display
        return {
          id: proxyBackend._id,
          apiName: proxyBackend.apiName(),
          requestPath: value.key,
          requestNumber,
          responseTime,
          uniqueUsers,
          successCallsCount,
          errorCallsCount,
          requestOverTime: currentPeriodBucket.requests_over_time.buckets,
          compareRequests,
          compareResponse,
          compareUsers,
        };
      }

      return undefined;
    })
      // Before display data filtering it.
      // These function will return Array with defined value
      .filter(value => { return value; })
      // Sort by name
      .sort((a, b) => {
        return a.apiName.localeCompare(b.apiName, language);
      });
  },
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
    return Template.instance().displayOverview.get(parameter);
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
