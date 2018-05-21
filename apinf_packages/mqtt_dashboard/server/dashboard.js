/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import _ from 'lodash';

import {
  calculateBandwidthKbs,
  calculateSecondsCount,
  indexesSet,
} from '../lib/helpers';
import promisifyCall from '../../core/helper_functions/promisify_call';
import {
  histogramDashboardDeliveredType, histogramDashboardPublishedType,
  histogramDashboardSubscribedType, statisticsDashboardDeliveredType,
  statisticsDashboardPublishedType, statisticsDashboardSubscribedType,
} from '../lib/dashboard_requests';

Meteor.methods({
  buildRequestDashboardData (timeframe, type, dateRange) {
    check(timeframe, String);
    check(type, String);
    check(dateRange, Object);

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';

    if (type === 'histogram') {
      // Build index for each event type (Histogram charts)
      const publishedIndex = indexesSet(timeframe, 'message_published', 'current');
      const deliveredIndex = indexesSet(timeframe, 'message_delivered', 'current');
      const subscribeIndex = indexesSet(timeframe, 'client_subscribe', 'current');

      const publishedQuery = histogramDashboardPublishedType(dateRange);
      const deliveredQuery = histogramDashboardDeliveredType(dateRange);
      const subscribeQuery = histogramDashboardSubscribedType(dateRange);

      const content =
        `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
        `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
        `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

      // Send request to ES
      return promisifyCall('multiSearchElasticsearch', url, content);
    }

    // Build index for each event type (Summary statistics)
    const publishedIndex = indexesSet(timeframe, 'message_published', type);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered', type);
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe', type);

    const publishedQuery = statisticsDashboardPublishedType(dateRange);
    const deliveredQuery = statisticsDashboardDeliveredType(dateRange);
    const subscribeQuery = statisticsDashboardSubscribedType(dateRange);

    const content =
      `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
      `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
      `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  fetchHistogramDashboardData (timeframe, dateRange) {
    check(timeframe, String);
    check(dateRange, Object);

    const secondsCount = calculateSecondsCount(timeframe);

    return promisifyCall('buildRequestDashboardData', timeframe, 'histogram', dateRange)
      .then(response => {
        const publishedData = _.get(response[0], 'aggregations.data_over_time.buckets', []);
        const deliveredData = _.get(response[1], 'aggregations.data_over_time.buckets', []);
        const subscribedData = _.get(response[2], 'aggregations.data_over_time.buckets', []);

        const publishedMessagesData = _.map(publishedData, (dataset) => {
          return { key: dataset.key, doc_count: dataset.doc_count };
        });

        const publishedClientsData = _.map(publishedData, (dataset) => {
          return { key: dataset.key, doc_count: dataset.client_publish.value };
        });

        const incomingBandwidthData = _.map(publishedData, (dataset) => {
          return {
            key: dataset.key,
            doc_count: calculateBandwidthKbs(dataset.incoming_bandwidth.value, secondsCount) };
        });

        const deliveredMessagesData = _.map(deliveredData, (dataset) => {
          return { key: dataset.key, doc_count: dataset.doc_count };
        });

        const outgoingBandwidthData = _.map(deliveredData, (dataset) => {
          return {
            key: dataset.key,
            doc_count: calculateBandwidthKbs(dataset.outgoing_bandwidth.value, secondsCount) };
        });

        const subscribedClientsData = _.map(subscribedData, (dataset) => {
          return { key: dataset.key, doc_count: dataset.client_subscribe.value };
        });

        return {
          publishedMessagesData,
          publishedClientsData,
          deliveredMessagesData,
          incomingBandwidthData,
          outgoingBandwidthData,
          subscribedClientsData,
        };
      })
      .catch(error => { throw new Meteor.Error(error); });
  },
  fetchSummaryStatisticsTopics (timeframe, dateRange, period) {
    check(timeframe, String);
    check(dateRange, Object);
    check(period, String);

    const secondsCount = calculateSecondsCount(timeframe);

    return promisifyCall('buildRequestDashboardData', timeframe, period, dateRange)
      .then(response => {
        const incomingSizeBytes = _.get(response[0], 'aggregations.incoming_bandwidth.value', 0);
        const outgoingSizeBytes = _.get(response[1], 'aggregations.outgoing_bandwidth.value', 0);

        return {
          incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
          outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
          publishedMessages: _.get(response[0], 'hits.total', 0),
          deliveredMessages: _.get(response[1], 'hits.total', 0),
          publishedClients: _.get(response[0], 'aggregations.client_publish.value', 0),
          subscribedClients: _.get(response[2], 'aggregations.client_subscribe.value', 0),
        };
      })
      .catch(error => { console.log(error); throw new Meteor.Error(error); });
  },
});
