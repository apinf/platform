/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import _ from 'lodash';
import { histogramDataRequestAllTopics, summaryStatisticsTopicsRequest,
} from '../lib/es_requests';
import { publishedClients } from '../lib/helpers';

Meteor.methods({
  getHistogramDataAllTopics (dateRange, secondsCount) {
    check(dateRange, Object);
    check(secondsCount, Number);

    // Build request to fetch data for Subscribed clients
    const bodyRequest = histogramDataRequestAllTopics(dateRange);

    // Get data from ES
    const result = Meteor.call('emqElastisticsearchSearch', bodyRequest);

    // Parsed it
    try {
      const aggregatedData = result.aggregations;

      const publishedMessagesData = aggregatedData.published.data_over_time.buckets;
      const deliveredMessagesData = aggregatedData.message_delivered.data_over_time.buckets;
      const publishedClientsData =
        publishedClients(aggregatedData.published.data_over_time.buckets, dateRange.to);
      const subscribedClientsData = aggregatedData.client_subscribe.data_over_time.buckets;

      const incomingBandwidthData = _.map(publishedMessagesData, (dataset) => {
        // Calculate Bandwidth in Kbps
        const kbps = (dataset.incoming_bandwidth.value * 0.001) / secondsCount;
        return {
          key: dataset.key,
          doc_count: +kbps.toFixed(2),
        };
      });

      const outgoingBandwidthData = _.map(deliveredMessagesData, (dataset) => {
        // Calculate Bandwidth in Kbps
        const kbps = (dataset.outgoing_bandwidth.value * 0.001) / secondsCount;
        return {
          key: dataset.key,
          doc_count: +kbps.toFixed(2),
        };
      });

      return {
        publishedMessagesData,
        deliveredMessagesData,
        publishedClientsData,
        subscribedClientsData,
        incomingBandwidthData,
        outgoingBandwidthData,
      };
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  getSummaryStatisticsTopics (dateRange, secondsCount) {
    check(dateRange, Object);
    check(secondsCount, Number);

    // Build request to fetch data for Subscribed clients
    const bodyRequest = summaryStatisticsTopicsRequest(dateRange);

    // Get data from ES
    const result = Meteor.call('emqElastisticsearchSearch', bodyRequest);
    // Parsed it
    try {
      const aggregatedData = result.aggregations;

      // Get Size in bytes
      const incomingSizeBytes = aggregatedData.message_published.incoming_bandwidth.value;
      const outgoingSizeBytes = aggregatedData.message_delivered.outgoing_bandwidth.value;

      // Calculate Bandwidth in Kbps
      const incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;
      const outgoingBandwidthKbps = (outgoingSizeBytes * 0.001) / secondsCount;

      return {
        incomingBandwidth: +incomingBandwidthKbps.toFixed(2),
        outgoingBandwidth: +outgoingBandwidthKbps.toFixed(2),
        pubMessagesCount: aggregatedData.message_published.doc_count,
        delMessagesCount: aggregatedData.message_delivered.doc_count,
        pubClientsCount: aggregatedData.message_published.client_published.value,
        subClientsCount: aggregatedData.client_subscribe.doc_count,
      };
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
});
