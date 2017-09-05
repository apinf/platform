/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Template } from 'meteor/templating';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
// eslint-disable-next-line max-len
import { arrowDirection, percentageValue, summaryComparing, calculateTrend } from '/apinf_packages/dashboard/client/trend_helpers';

Template.apiAnalyticView.helpers({
  arrowDirection (parameter) {
    // Provide compared data
    return arrowDirection(parameter, this);
  },
  percentages (parameter) {
    // Provide compared data
    return percentageValue(parameter, this);
  },
  summaryComparing (parameter) {
    // Get value of timeframe
    const currentTimeframe = FlowRouter.getQueryParam('timeframe');

    // Provide compared data
    return summaryComparing(parameter, this, currentTimeframe);
  },
  bucket () {
    const instance = Template.instance();
    // Get ES data
    const elasticsearchData = Template.currentData().elasticsearchData;

    const currentPeriodData = elasticsearchData.group_by_interval.buckets.currentPeriod;

    const requestNumber = currentPeriodData.doc_count;
    const responseTime = parseInt(currentPeriodData.response_time.values['50.0'], 10);
    const uniqueUsers = currentPeriodData.unique_users.buckets.length;

    const successCallsCount = currentPeriodData.response_status.buckets.success.doc_count;
    const redirectCallsCount = currentPeriodData.response_status.buckets.redirect.doc_count;
    const failCallsCount = currentPeriodData.response_status.buckets.fail.doc_count;
    const errorCallsCount = currentPeriodData.response_status.buckets.error.doc_count;

    const previousPeriodData = elasticsearchData.group_by_interval.buckets.previousPeriod;
    const previousResponseTime = previousPeriodData.response_time.values['50.0'];
    const previousUniqueUsers = previousPeriodData.unique_users.buckets.length;

    // Get the statistics comparing between previous and current periods
    const compareRequests = calculateTrend(previousPeriodData.doc_count, requestNumber);
    const compareResponse = calculateTrend(parseInt(previousResponseTime, 10), responseTime);
    const compareUsers = calculateTrend(previousUniqueUsers, uniqueUsers);

    return {
      proxyBackendId: instance.data.proxyBackendId,
      requestNumber,
      responseTime,
      uniqueUsers,
      successCallsCount,
      redirectCallsCount,
      failCallsCount,
      errorCallsCount,
      compareRequests,
      compareResponse,
      compareUsers,
      requestOverTime: currentPeriodData.requests_over_time.buckets,
    };
  },
  timelineData () {
    // Get ES data
    const elasticsearchData = Template.currentData().elasticsearchData;
    const currentPeriodData = elasticsearchData.group_by_interval.buckets.currentPeriod;

    return currentPeriodData.group_by_request_path.buckets;
  },
  mostFrequentUsers () {
    // Get ES data
    const elasticsearchData = Template.currentData().elasticsearchData;
    const currentPeriodData = elasticsearchData.group_by_interval.buckets.currentPeriod;

    return currentPeriodData.most_frequent_users.buckets;
  },
});

