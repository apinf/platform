/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collection imports
import StoredTopics from '../collection';

// APInf imports
import { publishedClients } from '../lib/helpers';
import { particularTopicHistogramRequest, particularTopicStatisticsRequest }
from '../lib/es_requests';

Meteor.methods({
  topicExists (id) {
    check(id, String);

    return StoredTopics.findOne(id);
  },
  dateHistogramDetailedTopic (eventType, dateRange, topic, secondsCount) {
    check(eventType, String);
    check(dateRange, Object);
    check(topic, String);
    check(secondsCount, Number);

    // Build request
    const bodyRequest = particularTopicHistogramRequest(eventType, dateRange, topic);

    // Get data from ES
    const result = Meteor.call('emqElastisticsearchSearch', bodyRequest);
    // Process data
    try {
      let chartData = result.aggregations.data_over_time.buckets;

      switch (eventType) {
        case 'client_publish': {
          // Prepare data for Published Clients Chart
          chartData = publishedClients(chartData, dateRange.to);
          break;
        }
        // Prepare data for Incoming Bandwidth Chart
        case 'incoming_bandwidth': {
          if (chartData.length > 0) {
            chartData = chartData.map(dataset => {
              const kbps = (dataset.incoming_bandwidth.value * 0.001) / secondsCount;
              return {
                key: dataset.key,
                doc_count: +kbps.toFixed(2),
              };
            });
          } else {
            // Create a point
            chartData.push({
              doc_count: 0,
              key: dateRange.to,
            });
          }
          break;
        }
        // Prepare data for Outgoing Bandwidth Chart
        case 'outgoing_bandwidth': {
          if (chartData.length > 0) {
            chartData = chartData.map(dataset => {
              const kbps = (dataset.outgoing_bandwidth.value * 0.001) / secondsCount;
              return {
                key: dataset.key,
                doc_count: +kbps.toFixed(2),
              };
            });
          } else {
            // Create a point
            chartData.push({
              doc_count: 0,
              key: dateRange.to,
            });
          }
          break;
        }
        default: {
          if (chartData.length === 0) {
            // Create a point
            chartData.push({
              doc_count: 0,
              key: dateRange.to,
            });
          }
        }
      }

      return chartData;
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  summaryStatisticsDetailedTopic (dateRange, topic, secondsCount) {
    check(dateRange, Object);
    check(topic, String);
    check(secondsCount, Number);

    // Build request
    const bodyRequest = particularTopicStatisticsRequest(dateRange, topic);

    // Get data from ES
    const result = Meteor.call('emqElastisticsearchSearch', bodyRequest);
    // Parsed it
    try {
      const topicTypes = result.aggregations.topic_types;

      // Get size
      const incomingSizeBytes = topicTypes.message_published.incoming_bandwidth.value;
      const outgoingSizeBytes = topicTypes.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth in Kb/s
      const incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;
      const outgoingBandwidthKbps = (outgoingSizeBytes * 0.001) / secondsCount;

      return {
        incoming_bandwidth: +incomingBandwidthKbps.toFixed(2),
        outgoing_bandwidth: +outgoingBandwidthKbps.toFixed(2),
        message_published: topicTypes.message_published.doc_count,
        message_delivered: topicTypes.message_delivered.doc_count,
        client_publish: topicTypes.message_published.client_published.value,
        client_subscribe: result.aggregations.client_subscribe.doc_count,
      };
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
});
