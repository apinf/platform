/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// NPM imports
import _ from 'lodash';

// Collection imports
import StoredTopics from '../collection';

// APInf imports
import { calculateTrend } from '../../dashboard/lib/trend_helpers';

Meteor.methods({
  topicsDataFetch (result, topicsList, secondsCount) {
    check(result, Object);
    check(topicsList, Array);
    check(secondsCount, Number);

    const currentPeriod = result.aggregations.group_by_interval.buckets.currentPeriod;
    const previousPeriod = result.aggregations.group_by_interval.buckets.previousPeriod;

    let incomingSizeBytes;
    let outgoingSizeBytes;
    let incomingBandwidthKbps;
    let outgoingBandwidthKbps;

    const topicsData = [];
    const trend = {};

    _.forEach(topicsList, (topic) => {
      const topicItem = StoredTopics.findOne({ value: topic });

      const messagesBucket = currentPeriod.group_by_topic.buckets[topic];
      const clientBucket = currentPeriod.clients.buckets[topic];

      // Get size
      incomingSizeBytes = messagesBucket.message_published.incoming_bandwidth.value;
      outgoingSizeBytes = messagesBucket.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth the Topic
      incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;
      outgoingBandwidthKbps = (outgoingSizeBytes * 0.001) / secondsCount;

      // Store data for the current Period for the Topic
      const datasetItem = {
        _id: topicItem._id,
        value: topic,
        incomingBandwidth: +incomingBandwidthKbps.toFixed(2),
        outgoingBandwidth: +outgoingBandwidthKbps.toFixed(2),
        publishedMessages: messagesBucket.message_published.doc_count,
        deliveredMessages: messagesBucket.message_delivered.doc_count,
        subscribedClients: clientBucket.client_subscribe.doc_count,
        publishedClients: messagesBucket.message_published.client_publish.value,
      };

      topicsData.push(datasetItem);

      const prevMessagesBucket = previousPeriod.group_by_topic.buckets[topic];
      const previousClientBucket = previousPeriod.clients.buckets[topic];

      // Get size
      incomingSizeBytes = prevMessagesBucket.message_published.incoming_bandwidth.value;
      outgoingSizeBytes = prevMessagesBucket.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth for the Topic
      incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;
      outgoingBandwidthKbps = (outgoingSizeBytes * 0.001) / secondsCount;

      // Store comparison data for the current Period for the Topic
      trend[topicItem.value] = {
        incomingBandwidth: calculateTrend(
          +incomingBandwidthKbps.toFixed(2), datasetItem.incomingBandwidth
        ),
        outgoingBandwidth: calculateTrend(
          +outgoingBandwidthKbps.toFixed(2), datasetItem.outgoingBandwidth
        ),
        publishedMessages: calculateTrend(
          prevMessagesBucket.message_published.doc_count, datasetItem.publishedMessages
        ),
        deliveredMessages: calculateTrend(
          prevMessagesBucket.message_delivered.doc_count, datasetItem.deliveredMessages
        ),
        subscribedClients: calculateTrend(
          previousClientBucket.client_subscribe.doc_count, datasetItem.subscribedClients
        ),
        publishedClients: calculateTrend(
          prevMessagesBucket.message_published.client_publish.value, datasetItem.publishedClients
        ),
      };
    });

    return { topicsData, trend };
  },
  remainingTrafficFetch (result, secondsCount) {
    check(result, Object);
    check(secondsCount, Number);

    try {
      const currentPeriod = result.aggregations.group_by_interval.buckets.currentPeriod;
      const previousPeriod = result.aggregations.group_by_interval.buckets.previousPeriod;

      // Get size
      let incomingSizeBytes = currentPeriod.message_published.incoming_bandwidth.value;
      let outgoingSizeBytes = currentPeriod.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth for the current period
      let incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;
      let outgoingBandwidthKbps = (outgoingSizeBytes * 0.001) / secondsCount;

      // Store data for the current Period
      const dataset = {
        value: 'remaining',
        incomingBandwidth: +incomingBandwidthKbps.toFixed(2),
        outgoingBandwidth: +outgoingBandwidthKbps.toFixed(2),
        publishedMessages: currentPeriod.message_published.doc_count,
        deliveredMessages: currentPeriod.message_delivered.doc_count,
        subscribedClients: currentPeriod.client_subscribe.doc_count,
        publishedClients: currentPeriod.message_published.client_publish.value,
      };

      // Get size
      incomingSizeBytes = previousPeriod.message_published.incoming_bandwidth.value;
      outgoingSizeBytes = previousPeriod.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth for the previous period
      incomingBandwidthKbps = (incomingSizeBytes) / secondsCount;
      outgoingBandwidthKbps = (outgoingSizeBytes) / secondsCount;

      // Store comparison data for the current Period
      const trend = {
        incomingBandwidth: calculateTrend(
          +incomingBandwidthKbps.toFixed(2), dataset.incomingBandwidth
        ),
        outgoingBandwidth: calculateTrend(
          +outgoingBandwidthKbps.toFixed(2), dataset.outgoingBandwidth
        ),
        publishedMessages: calculateTrend(
          previousPeriod.message_published.doc_count, dataset.publishedMessages
        ),
        deliveredMessages: calculateTrend(
          previousPeriod.message_delivered.doc_count, dataset.deliveredMessages
        ),
        subscribedClients: calculateTrend(
          previousPeriod.client_subscribe.doc_count, dataset.subscribedClients
        ),
        publishedClients: calculateTrend(
          previousPeriod.message_published.client_publish.value, dataset.publishedClients
        ),
      };

      return { dataset, trend };
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  autocompletedDataFetch (response, searchedTopic) {
    check(response, Object);
    check(searchedTopic, String);

    try {
      const topicsData = response.aggregations.autocomplete.topic_value.buckets;

      const topicsList = topicsData.map(x => {
        // Truncate to next '/'
        const topicTree = x.key.substr(0, x.key.indexOf('/', searchedTopic.length) + 1);
        return `${topicTree}#`;
      });

      // Return unique values
      return _.uniq(topicsList).map(topic => {
        return {
          id: topic,
          text: topic,
        };
      });
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
});
