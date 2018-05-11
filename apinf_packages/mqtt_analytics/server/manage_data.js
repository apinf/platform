/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collections imports
import AnalyticsData from '/apinf_packages/analytics/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import _ from 'lodash';
import moment from 'moment/moment';

// APInf imports
import EmqAnalyticsData from '../collection';
import eventTypeConvert from '../lib/event_type_convert';

Meteor.methods({
  histogramTopicMongo (eventType, dateRange, topic) {
    check(topic, String);
    check(eventType, String);
    check(dateRange, Object);

    const chartData = [];
    const relatedField = eventTypeConvert(eventType);

    EmqAnalyticsData.find({
      topic,
      date: { $gte: dateRange.from, $lt: dateRange.to },
    }).forEach(dataset => {
      chartData.push({
        doc_count: dataset[relatedField],
        key: dataset.date,
      });
    });

    return chartData;
  },
  summaryStatisticsTopicMongo (dateRange, topicsList, secondsCount) {
    check(dateRange, Object);
    check(topicsList, Array);
    check(secondsCount, Number);

    const data = {};

    EmqAnalyticsData.aggregate(
      [
        {
          $match: {
            date: { $gte: dateRange.from, $lt: dateRange.to },
            topic: { $in: topicsList },
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $group: {
            _id: '$topic',
            message_published: { $sum: '$publishedMessages' },
            message_delivered: { $sum: '$deliveredMessages' },
            incomingSizeBytes: { $sum: '$incomingMessageSizeBytes' },
            outgoingSizeBytes: { $sum: '$outgoingMessageSizeBytes' },
            client_publish: { $sum: '$publishedClients' },
            client_subscribe: { $sum: '$subscribedClients' },
          },
        },
      ]
    ).forEach(dataset => {
      // Calculate Bandwidth in Kb/s
      const incomingBandwidthKbps = (dataset.incomingSizeBytes * 0.001) / secondsCount;
      const outgoingBandwidthKbps = (dataset.outgoingSizeBytes * 0.001) / secondsCount;

      data[dataset._id] = {
        topic: dataset._id, // Just rename it
        incoming_bandwidth: +incomingBandwidthKbps.toFixed(2),
        outgoing_bandwidth: +outgoingBandwidthKbps.toFixed(2),
      };

      Object.assign(data[dataset._id], dataset);
    });

    return data;
  },
});
