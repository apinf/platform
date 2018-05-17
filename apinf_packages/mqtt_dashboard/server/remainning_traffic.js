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
import { indexesSet,
  remainingTrafficDeliveredType, remainingTrafficPublishedType,
  remainingTrafficSubscribedType,
} from '../lib/es_requests';
import { calculateSecondsCount, calculateBandwidthKbs } from '../lib/helpers';

Meteor.methods({
  buildRequestRemainingTraffic (topicsList, timeframe, period, dateRang) {
    check(topicsList, Array);
    check(timeframe, String);
    check(period, String);
    check(dateRang, Object);

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

    return promisifyCall('buildRequestRemainingTraffic', topicsList, timeframe, 'current', dateRange)
      .then(response => {
        const incomingSizeBytes = _.get(response[0], 'aggregations.incoming_bandwidth.value', 0);
        const outgoingSizeBytes = _.get(response[1], 'aggregations.outgoing_bandwidth.value', 0);

        currentDatasetTraffic = {
          value: 'remaining',
          incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
          outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
          publishedMessages: response[0].hits.total,
          deliveredMessages: response[1].hits.total,
          subscribedClients: _.get(response[2], 'aggregations.client_subscribe.value', 0),
          publishedClients: _.get(response[0], 'aggregations.client_published.value', 0),
        };

        const previousDateRange = {
          from: dateRange.doublePeriodAgo,
          to: dateRange.onePeriodAgo,
        };

        return promisifyCall('buildRequestRemainingTraffic', topicsList, timeframe, 'previous', previousDateRange);
      })
      .then(response => {
        const incomingSizeBytes = _.get(response[0], 'aggregations.incoming_bandwidth.value', 0);
        const outgoingSizeBytes = _.get(response[1], 'aggregations.outgoing_bandwidth.value', 0);

        const previousDatasetTraffic = {
          incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
          outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
          publishedMessages: response[0].hits.total,
          deliveredMessages: response[0].hits.total,
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
      .catch(error => { console.log('Error: ', error); });
  },
});
