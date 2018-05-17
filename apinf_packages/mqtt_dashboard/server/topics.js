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
  async dataForTable (dateRange, topicsList) {
    let currentDataset;
    const secondsCount = 60 * 60 * 24;
    const topicsData = [];
    const trend = {};

    return await promisifyCall('summaryStatisticsTopicMongo', dateRange, topicsList, secondsCount)
      .then(response => {
        currentDataset = response;

        const previousPeriodRange = {
          from: dateRange.doublePeriodAgo,
          to: dateRange.onePeriodAgo,
        };

        return promisifyCall('summaryStatisticsTopicMongo', previousPeriodRange, topicsList, secondsCount)
      })
      .then(previousDataset => {
        _.forEach(topicsList, (topic) => {
          const topicItem = StoredTopics.findOne({value: topic});

          // Store data for the current Period for the Topic
          const datasetItem = {
            _id: topicItem._id,
            value: topic,
            incomingBandwidth: currentDataset[topic].incoming_bandwidth,
            outgoingBandwidth: currentDataset[topic].outgoing_bandwidth,
            publishedMessages: currentDataset[topic].message_published,
            deliveredMessages: currentDataset[topic].message_delivered,
            subscribedClients: currentDataset[topic].client_subscribe,
            publishedClients: currentDataset[topic].client_publish,
          };

          topicsData.push(datasetItem);

          // Store comparison data for the current Period for the Topic
          trend[topic] = {
            incomingBandwidth: calculateTrend(
              previousDataset[topic].incoming_bandwidth, currentDataset[topic].incoming_bandwidth
            ),
            outgoingBandwidth: calculateTrend(
              previousDataset[topic].outgoing_bandwidth, currentDataset[topic].outgoing_bandwidth
            ),
            publishedMessages: calculateTrend(
              previousDataset[topic].message_published, currentDataset[topic].message_published
            ),
            deliveredMessages: calculateTrend(
              previousDataset[topic].message_delivered, currentDataset[topic].message_delivered
            ),
            subscribedClients: calculateTrend(
              previousDataset[topic].client_subscribe, currentDataset[topic].client_subscribe
            ),
            publishedClients: calculateTrend(
              previousDataset[topic].client_publish, currentDataset[topic].client_publish
            ),
          };
        });

        return { topicsData, trend };
      });
  },
  buildRequestTopicsTableData (topicsList, timeframe, period) {
    check(topicsList, Array);
    check(timeframe, String);
    check(period, String);

    // Create filter to aggregate by topic
    const filters = { filters: {} };

    topicsList.forEach(value => {
      filters.filters[value] = { prefix: { 'topic.keyword': value } };
    });

    // Build index for each event type
    const publishedIndex = indexesSet(timeframe, 'message_published', period);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered', period);
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe', period);

    // Build query body for each event type
    const publishedQuery = topicsTablePublishedType(filters);
    const deliveredQuery = topicsTableDeliveredType(filters);
    const subscribeQuery = topicsTableSubscribedType(filters);

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';
    const content =
      `{"index" : "${publishedIndex}", "ignoreUnavailable": true}\n${publishedQuery}\n` +
      `{"index" : "${deliveredIndex}", "ignoreUnavailable": true}\n${deliveredQuery}\n` +
      `{"index" : "${subscribeIndex}", "ignoreUnavailable": true}\n${subscribeQuery}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  fetchTopicsTableData (topicsList, timeframe) {
    check(topicsList, Array);
    check(timeframe, String);

    let currentPublished;
    let currentDelivered;
    let currentSubscribed;

    return promisifyCall('buildRequestTopicsTableData', topicsList, timeframe, 'current')
      .then(response => {
        currentPublished = response[0].aggregations;
        currentDelivered = response[1].aggregations;
        currentSubscribed = response[2].aggregations;

        if (response[0].status === 200) {
          return promisifyCall('buildRequestTopicsTableData', topicsList, timeframe, 'previous');
        }

        throw new Meteor.Error(response[0].error.type);
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
              _.get(currentSubscribed, `${pathToTopic}.client_subscribe.doc_count`, 0),
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

          console.log('trend', trend)
          // console.log('currentDatasetTopic', currentDatasetTopic)
          // console.log('previousDatasetTopic', previousDatasetTopic)
        });

        return { topicsData, trend };
      })
      .catch(error => { console.log('ERROR', error); });
  },
});
