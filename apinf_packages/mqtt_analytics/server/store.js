/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collections imports
import EmqAnalyticsData from '/apinf_packages/mqtt_analytics/collection';
import Proxies from '/apinf_packages/proxies/collection';

// Npm packages imports
import moment from 'moment';
import _ from 'lodash';

// APInf imports
import topicsDataOnePeriodRequest from '../../mqtt_analytics/server/query';
import StoredTopics from '../../mqtt_dashboard/collection';

Meteor.methods({
  emqAnalyticsData (hoursCount, daysCount, lastDayType) {
    check(hoursCount, Number);
    check(daysCount, Number);
    check(lastDayType, String);

    // Get proxy backend
    const proxy = Proxies.findOne({ type: 'emq' });

    // make sure Proxy Backend exists
    if (proxy) {
      const topicsCount = StoredTopics.find().count();

      if (topicsCount > 0) {
        Meteor.call('storeEmqAnalyticsData',
          { proxyId: proxy._id, daysCount, hoursCount, lastDayType }
        );
      } else {
        throw new Meteor.Error('No Stored topics exist');
      }
    } else {
      throw new Meteor.Error('No EMQ Proxy');
    }
  },
  storeEmqAnalyticsData (params) {
    check(params, Object);

    const topics = StoredTopics.find().fetch();

    // F0r each Stored Topics fill EMQ Analytics Data collection for last 60 days and last 48 hours
    const filters = { filters: {} };
    const clientFilters = { filters: {} };

    // Go through all topics and create the filters objects
    topics.forEach(topicItem => {
      const topic = topicItem.value;
      const field = `topics.${topic}#.qos`;

      filters.filters[topic] = { prefix: { 'topic.keyword': topic } };
      clientFilters.filters[topic] = { term: { [field]: 0 } };
    });

    const { proxyId, daysCount, hoursCount, lastDayType } = params;

    // Take last hoursCount hours

    // Seconds in 1 hour
    const secondsCount = 60 * 60;
    // Take last hoursCount hours
    for (let i = 0; i < hoursCount; i++) {
      // Get timestamp of upper date range interval (excluded value)
      const to = moment().subtract(i, 'h').set({ m: 0, s: 0, ms: 0 }).valueOf();
      // Get timestamp of lower date range interval (included value)
      const from = moment().subtract(i + 1, 'h').set({ m: 0, s: 0, ms: 0 }).valueOf();
      // Get human readable format
      const dateAsString = moment(from).format('MM-DD-YYYY');
      const timeAsString = moment(from).format('HH:mm:ss');

      // Create the query to ElasticSearch
      const query = topicsDataOnePeriodRequest({ from, to }, filters, clientFilters);

      // Create a cursor for Bulk operation
      const bulk = EmqAnalyticsData.rawCollection().initializeUnorderedBulkOp();

      // Send request to ElasticSearch. Sync call
      const response = Meteor.call('emqElastisticsearchSearch', query);

      // Get data that are grouped by requested path
      const aggregatedDataResponse = response.aggregations.group_by_topic.buckets;
      const clientsResponse = response.aggregations.clients.buckets;

      _.mapKeys(aggregatedDataResponse, (analyticsData, requestTopic) => {
        // Get related Proxy Backend instance to take info about _id and proxyId
        const topic = StoredTopics.findOne({
          value: requestTopic,
        });

        // Try to get analytics data for current day and current proxy backend
        const dataForCurrentTime = EmqAnalyticsData.findOne({
          date_as_string: dateAsString,
          time_as_string: timeAsString,
          topicId: topic._id,
        });

        const publishedMessages = analyticsData.message_published.doc_count;
        const deliveredMessages = analyticsData.message_delivered.doc_count;
        const publishedClients = analyticsData.message_published.client_publish.value;
        const subscribedClients = clientsResponse[requestTopic].client_subscribe.doc_count;

        // Get size
        const incomingSizeBytes = analyticsData.message_published.incoming_bandwidth.value;
        const outgoingSizeBytes = analyticsData.message_delivered.outgoing_bandwidth.value;

        // Calculate Bandwidth the Topic
        const incomingBandwidth = (incomingSizeBytes * 0.001) / secondsCount;
        const outgoingBandwidth = (outgoingSizeBytes * 0.001) / secondsCount;

        const data = {
          proxyId,
          topicId: topic._id,
          topic: requestTopic,
          date: from,
          date_as_string: dateAsString,
          time_as_string: timeAsString,
          publishedMessages,
          deliveredMessages,
          publishedClients,
          subscribedClients,
          incomingBandwidth,
          outgoingBandwidth,
          incomingMessageSizeBytes: incomingSizeBytes,
          outgoingMessageSizeBytes: outgoingSizeBytes,
        };

        if (dataForCurrentTime) {
          bulk.find({
            date_as_string: dateAsString, time_as_string: timeAsString, topicId: topic._id,
          }).update({ $set: data });
        } else {
          bulk.insert(data);
        }
      });

      // Execute all insert operation
      bulk.execute();
    }
  },
});
