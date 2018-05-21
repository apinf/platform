/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import StoredTopics from '../collection';

// APInf imports
import {
  indexesSet,
  calculateSecondsCount,
  calculateBandwidthKbs,
} from '../lib/helpers';
import _ from 'lodash';
import promisifyCall from '../../core/helper_functions/promisify_call';
import {
  histogramTopicGeneralType,
  statisticsTopicDeliveredType,
  statisticsTopicPublishedType, statisticsTopicSubscribedType,
} from '../lib/topic_requests';

Meteor.methods({
  topicExists (id) {
    check(id, String);

    return StoredTopics.findOne(id);
  },
  buildRequestTopicData (dateRange, params) {
    check(dateRange, Object);
    check(params, Object);

    const { timeframe, dataType, eventType, topic } = params;

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';

    if (dataType === 'histogram') {
      let indexEventType = eventType;

      if (eventType === 'incoming_bandwidth' || eventType === 'client_publish') {
        indexEventType = 'message_published';
      } else if (eventType === 'outgoing_bandwidth') {
        indexEventType = 'message_delivered';
      }

      // Build index for particular event type (Histogram charts)
      const index = indexesSet(timeframe, indexEventType, 'current');

      const queryBody = histogramTopicGeneralType(dateRange, eventType, topic);

      const content =
        `{"index" : "${index}", "ignoreUnavailable": true}\n${queryBody}\n`;

      // Send request to ES
      return promisifyCall('multiSearchElasticsearch', url, content);
    }

    // Build index for each event type (Summary statistics)
    const publishedIndex = indexesSet(timeframe, 'message_published', dataType);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered', dataType);
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe', dataType);

    const publishedQuery = statisticsTopicPublishedType(dateRange, topic);
    const deliveredQuery = statisticsTopicDeliveredType(dateRange, topic);
    const subscribeQuery = statisticsTopicSubscribedType(dateRange, topic);

    const content =
      `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
      `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
      `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  fetchHistogramTopicData (dateRange, params) {
    check(dateRange, Object);
    check(params, Object);

    return promisifyCall('buildRequestTopicData', dateRange, params)
      .then(response => {
        const dataOverTime = _.get(response[0], 'aggregations.data_over_time.buckets', []);
        let chartData;

        switch (params.eventType) {
          case 'incoming_bandwidth':
          case 'outgoing_bandwidth': {
            const secondsCount = calculateSecondsCount(params.timeframe);

            chartData = _.map(dataOverTime, (dataset) => {
              return {
                key: dataset.key,
                doc_count: calculateBandwidthKbs(dataset.chart_point.value, secondsCount) };
            });
            break;
          }
          case 'client_publish':
          case 'client_subscribe': {
            chartData = _.map(dataOverTime, (dataset) => {
              return { key: dataset.key, doc_count: dataset.chart_point.value };
            });
            break;
          }
          // Message Published OR Message Delivered
          default: {
            chartData = _.map(dataOverTime, (dataset) => {
              return { key: dataset.key, doc_count: dataset.doc_count };
            });
          }
        }

        return chartData;
      })
      .catch(error => { throw new Meteor.Error(error); });
  },
  fetchSummaryStatisticsTopic (dateRange, params) {
    check(dateRange, Object);
    check(params, Object);

    const secondsCount = calculateSecondsCount(params.timeframe);

    return promisifyCall('buildRequestTopicData', dateRange, params)
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
      .catch(error => { throw new Meteor.Error(error); });
  },
});
