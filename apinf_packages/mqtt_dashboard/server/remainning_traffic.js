/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// NPM imports
import _ from 'lodash';


// APInf imports
import { calculateTrend } from '../../dashboard/lib/trend_helpers';
import promisifyCall from '../../core/helper_functions/promisify_call';
import { remainingTrafficDeliveredType, remainingTrafficPublishedType,
  remainingTrafficSubscribedType,
} from '../lib/topics_requests';
import { indexesSet, calculateSecondsCount, calculateBandwidthKbs } from '../lib/helpers';

Meteor.methods({
  buildRequestRemainingTraffic (topicsList, params, dateRang) {
    check(topicsList, Array);
    check(params, Object);
    check(dateRang, Object);

    const { timeframe, period } = params;

    let filter;

    if (topicsList.length === 0) {
      filter = [{ match_phrase_prefix: { topic: '' } }];
    } else {
      filter = topicsList.map(value => {
        return { match_phrase_prefix: { topic: value } };
      });
    }

    // Build index for each event type
    const publishedIndex = indexesSet(timeframe, 'message_published', period);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered', period);
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe', period);

    // Build query body for each event type
    const publishedQuery = remainingTrafficPublishedType(filter, dateRang);
    const deliveredQuery = remainingTrafficDeliveredType(filter, dateRang);
    const subscribeQuery = remainingTrafficSubscribedType(filter, dateRang);

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';
    const content =
      `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
      `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
      `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  fetchRemainingTrafficData (topicsList, timeframe, dateRange) {
    check(topicsList, Array);
    check(timeframe, String);
    check(dateRange, Object);

    // const topicsList = ['/hfp/v1/journey/ongoing/train/'];
    const secondsCount = calculateSecondsCount(timeframe);
    let currentDatasetTraffic = {};

    const params = {
      timeframe,
      period: 'current',
    };

    return promisifyCall('buildRequestRemainingTraffic', topicsList, params, dateRange)
      .then(response => {
        const incomingSizeBytes = _.get(response[0], 'aggregations.incoming_bandwidth.value', 0);
        const outgoingSizeBytes = _.get(response[1], 'aggregations.outgoing_bandwidth.value', 0);

        currentDatasetTraffic = {
          value: 'remaining',
          incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
          outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
          publishedMessages: _.get(response[0], 'hits.total', 0),
          deliveredMessages: _.get(response[1], 'hits.total', 0),
          subscribedClients: _.get(response[2], 'aggregations.client_subscribe.value', 0),
          publishedClients: _.get(response[0], 'aggregations.client_published.value', 0),
        };

        const previousDateRange = {
          from: dateRange.doublePeriodAgo,
          to: dateRange.onePeriodAgo,
        };

        params.period = 'previous';

        return promisifyCall('buildRequestRemainingTraffic', topicsList, params, previousDateRange);
      })
      .then(response => {
        const incomingSizeBytes = _.get(response[0], 'aggregations.incoming_bandwidth.value', 0);
        const outgoingSizeBytes = _.get(response[1], 'aggregations.outgoing_bandwidth.value', 0);

        const previousDatasetTraffic = {
          incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
          outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
          publishedMessages: _.get(response[0], 'hits.total', 0),
          deliveredMessages: _.get(response[1], 'hits.total', 0),
          subscribedClients: _.get(response[2], 'aggregations.client_subscribe.value', 0),
          publishedClients: _.get(response[0], 'aggregations.client_published.value', 0),
        };

        const trend = {
          incomingBandwidth: calculateTrend(
            previousDatasetTraffic.incomingBandwidth, currentDatasetTraffic.incomingBandwidth
          ),
          outgoingBandwidth: calculateTrend(
            previousDatasetTraffic.outgoingBandwidth, currentDatasetTraffic.outgoingBandwidth
          ),
          publishedMessages: calculateTrend(
            previousDatasetTraffic.publishedMessages, currentDatasetTraffic.publishedMessages
          ),
          deliveredMessages: calculateTrend(
            previousDatasetTraffic.deliveredMessages, currentDatasetTraffic.deliveredMessages
          ),
          subscribedClients: calculateTrend(
            previousDatasetTraffic.subscribedClients, currentDatasetTraffic.subscribedClients
          ),
          publishedClients: calculateTrend(
            previousDatasetTraffic.publishedClients, currentDatasetTraffic.publishedClients
          ),
        };

        return {
          trafficData: currentDatasetTraffic,
          trend,
        };
      })
      .catch(error => { throw new Meteor.Error(error); });
  },
});
