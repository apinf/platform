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
import promisifyCall from '../../core/helper_functions/promisify_call';
import { indexesSet,
  topicsTableDeliveredType, topicsTablePublishedType,
  topicsTableSubscribedType,
} from '../lib/es_requests';
import { calculateSecondsCount, calculateBandwidthKbs } from '../lib/helpers';

Meteor.methods({
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
  buildRequestTopicsTableData (topicsList, timeframe, period, dateRange) {
    check(topicsList, Array);
    check(timeframe, String);
    check(period, String);
    check(dateRange, Object);

    // Create filter to aggregate by topic
    const filters = { filters: {} };
    const clientFilters = { filters: {} };

    topicsList.forEach(value => {
      filters.filters[value] = { prefix: { 'topic.keyword': value } };

      const field = `topics.${value}#.qos`;
      clientFilters.filters[value] = { term: { [field]: 0 } };
    });

    // Build index for each event type
    const publishedIndex = indexesSet(timeframe, 'message_published', period);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered', period);
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe', period);

    // Build query body for each event type
    const publishedQuery = topicsTablePublishedType(filters, dateRange);
    const deliveredQuery = topicsTableDeliveredType(filters, dateRange);
    const subscribeQuery = topicsTableSubscribedType(clientFilters, dateRange);

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';
    const content =
      `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
      `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
      `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  fetchTopicsTableData (topicsList, timeframe, dateRange) {
    check(topicsList, Array);
    check(timeframe, String);
    check(dateRange, Object);

    let currentPublished;
    let currentDelivered;
    let currentSubscribed;

    return promisifyCall('buildRequestTopicsTableData', topicsList, timeframe, 'current', dateRange)
      .then(response => {
        currentPublished = response[0].aggregations;
        currentDelivered = response[1].aggregations;
        currentSubscribed = response[2].aggregations;

        const previousDateRange = {
          from: dateRange.doublePeriodAgo,
          to: dateRange.onePeriodAgo,
        };

        return promisifyCall('buildRequestTopicsTableData', topicsList, timeframe, 'previous', previousDateRange);
      })
      .then(response => {
        if (response[0].error) throw new Meteor.Error(response[0].error.type);

        const previousPublished = response[0].aggregations;
        const previousDelivered = response[1].aggregations;
        const previousSubscribed = response[2].aggregations;

        // Calculate for Bandwidth data
        const secondsCount = calculateSecondsCount(timeframe);
        const topicsData = [];
        const trend = {};

        _.forEach(topicsList, (topic) => {
          const topicItem = StoredTopics.findOne({ value: topic });

          const pathToTopic = `group_by_topic.buckets['${topic}']`;
          // Get size
          let incomingSizeBytes =
            _.get(currentPublished, `${pathToTopic}.incoming_bandwidth.value`, 0);
          let outgoingSizeBytes =
            _.get(currentDelivered, `${pathToTopic}.outgoing_bandwidth.value`, 0);

          // Store data for the current Period for the Topic
          const currentDatasetTopic = {
            _id: topicItem._id,
            value: topic,
            incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
            outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
            publishedMessages: _.get(currentPublished, `${pathToTopic}.doc_count`, 0),
            deliveredMessages: _.get(currentDelivered, `${pathToTopic}.doc_count`, 0),
            subscribedClients:
              _.get(currentSubscribed, `${pathToTopic}.client_subscribe.value`, 0),
            publishedClients: _.get(currentPublished, `${pathToTopic}.client_published.value`, 0),
          };

          topicsData.push(currentDatasetTopic);

          // Get size
          incomingSizeBytes =
            _.get(previousPublished, `${pathToTopic}.incoming_bandwidth.value`, 0);
          outgoingSizeBytes =
            _.get(previousDelivered, `${pathToTopic}.outgoing_bandwidth.value`, 0);

          // Store data for the current Period for the Topic
          const previousDatasetTopic = {
            incomingBandwidth: calculateBandwidthKbs(incomingSizeBytes, secondsCount),
            outgoingBandwidth: calculateBandwidthKbs(outgoingSizeBytes, secondsCount),
            publishedMessages: _.get(previousPublished, `${pathToTopic}.doc_count`, 0),
            deliveredMessages: _.get(previousDelivered, `${pathToTopic}.doc_count`, 0),
            subscribedClients:
              _.get(previousSubscribed, `${pathToTopic}.client_subscribe.doc_count`, 0),
            publishedClients: _.get(previousPublished, `${pathToTopic}.client_published.value`, 0),
          };

          // Store comparison data for the current Period for the Topic
          trend[topic] = {
            incomingBandwidth: calculateTrend(
              previousDatasetTopic.incomingBandwidth, currentDatasetTopic.incomingBandwidth
            ),
            outgoingBandwidth: calculateTrend(
              previousDatasetTopic.outgoingBandwidth, currentDatasetTopic.outgoingBandwidth
            ),
            publishedMessages: calculateTrend(
              previousDatasetTopic.publishedMessages, currentDatasetTopic.publishedMessages
            ),
            deliveredMessages: calculateTrend(
              previousDatasetTopic.deliveredMessages, currentDatasetTopic.deliveredMessages
            ),
            subscribedClients: calculateTrend(
              previousDatasetTopic.subscribedClients, currentDatasetTopic.subscribedClients
            ),
            publishedClients: calculateTrend(
              previousDatasetTopic.publishedClients, currentDatasetTopic.publishedClients
            ),
          };
        });

        return { topicsData, trend };
      })
      .catch(error => { console.log('ERROR', error); });
  },
});
