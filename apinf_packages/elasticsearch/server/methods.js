/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Npm packages imports
import { Client as ESClient } from 'elasticsearch';

import Proxies from '../../proxies/collection';

import {topicsTablePublishedType, topicsTableDeliveredType, topicsTableSubscribedType,indexesSet} from '/apinf_packages/mqtt_dashboard/lib/es_requests'
import promisifyCall from '../../core/helper_functions/promisify_call';
import _ from 'lodash';
import {calculateTrend} from '../../dashboard/lib/trend_helpers';
import StoredTopics from '../../mqtt_dashboard/collection';

Meteor.methods({
  getElasticsearchData (host, queryParams) {
    // Make sure params are String type
    check(host, String);
    check(queryParams, Object);

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ESClient({ host });

    return esClient
      .ping({
        // ping usually has a 5000ms timeout
        requestTimeout: 5000,
      })
      .then(() => {
        return esClient.search(queryParams);
      })
      .catch(error => {
        // Throw an error
        throw new Meteor.Error(error);
      });
  },
  async emqElasticsearchPing () {
    const proxy = Proxies.findOne({ type: 'emq' });

    const host = proxy.emq.elasticsearch;

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ESClient({ host });

    try {
      return await esClient.ping({
        // ping usually has a 5s timeout
        requestTimeout: 5000,
      });
    } catch (e) {
      // Throw an error message
      throw new Meteor.Error(e.message);
    }
  },
  async emqElastisticsearchSearch (requestBody) {
    check(requestBody, Object);

    const proxy = Proxies.findOne({ type: 'emq' });

    const host = proxy.emq.elasticsearch;

    const query = {
      index: 'mqtt',
      size: 0,
      body: requestBody,
    };

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ESClient({ host });

    try {
      return await esClient.search(query);
    } catch (e) {
      // Throw an error message
      throw new Meteor.Error(e.message);
    }
  },
  emqElastisticsearchMulti (timeframe, period) {
    // const params = {
    //   headers: { 'Content-Type': 'application/x-ndjson' },
    //   content: '{"index": "<message_published-{now/d-2d}>,<message_published-{now/d-1d}>"}\n'+
    //            '{"size": 1,"query":{"bool":{}}}',
    // };
    //
    // HTTP.get('http://hap.cinfra.fi:9200/_msearch', params, (error, response) => {
    //   console.log('error', error)
    //   console.log('response', response)
    // });

    const publishedIndex = indexesSet(timeframe, 'message_published', period);
    const deliveredIndex = indexesSet(timeframe, 'message_delivered');
    const subscribeIndex = indexesSet(timeframe, 'client_subscribe');

    const publishedQuery = topicsTablePublishedType();
    const deliveredQuery = topicsTableDeliveredType();

    const subscribeQuery = topicsTableSubscribedType();

    const url = 'http://hap.cinfra.fi:9200/_msearch?pretty=true';
    const content =
      `{"index" : "${publishedIndex}"}\n${publishedQuery}\n`
       // {"index" : "${deliveredIndex}"}\n${deliveredQuery}\n`
       // {"index" : "${subscribeIndex}"}\n${subscribeQuery}\n`;

    const headers = { 'Content-Type': 'application/x-ndjson' };

    return new Promise((resolve, reject) => {
      HTTP.call('GET', url, { content, headers }, (error, response) => {
        if (error) reject(error);
        resolve(response.data.responses);
      });
    });

    // check(requestBody, Object);

    // const proxy = Proxies.findOne({ type: 'emq' });
    //
    // const host = proxy.emq.elasticsearch;
    //
    // const body = [
    //   {"index": "<message_published-{now/d-2d}>,<message_published-{now/d-1d}>"},
    //   {"size": 0,"query":{"bool":{}}, "aggs":{"group_by_topics": {"filters":{"filters": {"/hfp/v1/journey/ongoing/train/": { "prefix": { "topic.keyword": "/hfp/v1/journey/ongoing/train/" } }}}}}}
    // ];

    // const query = {
    //   index: "<message_published-{now/d}>,<message_published-{now/d-1d}>",
    //   size: 0,
    //   body:
    // };

    // Initialize Elasticsearch client, using provided host value
    // const esClient = new ESClient({
    //   host: [{
    //     host: 'hap.cinfra.fi',
    //     headers: ,
    //   }],
    // });
    //
    // try {
    //   return await esClient.msearch({
    //     body: body,
    //   }).then(response => console.log(response)).catch(error => { console.log('error', error)});
    // } catch (e) {
    //   // Throw an error message
    //   throw new Meteor.Error(e.message);
    // }
  },
  test (timeframe) {
    let currentPeriod;
    const topicsList = ["/hfp/v1/journey/ongoing/train/"];

    promisifyCall('emqElastisticsearchMulti', timeframe, 'current')
      .then(response => {
        currentPeriod = response;

        if (currentPeriod[0].status === 200) {
          return promisifyCall('emqElastisticsearchMulti', timeframe, 'previous');
        }

        throw new Meteor.Error(response[0].error.type);
      })
      .then(previousPeriod => {
        if (previousPeriod[0].error) throw new Meteor.Error(previousPeriod[0].error.type);

        const secondsCount = 60 * 60 * 24;
        const topicsData = [];
        const trend = {};

        const currentPublishedData = currentPeriod[0].aggregations.group_by_topic.buckets;
        const previousPublishedData = previousPeriod[0].aggregations.group_by_topic.buckets;
console.log(currentPublishedData)
        _.forEach(topicsList, (topic) => {
          const topicItem = StoredTopics.findOne({ value: topic });

          // Get size
          let incomingSizeBytes = currentPublishedData[topic].incoming_bandwidth.value;

          // Calculate Bandwidth the Topic
          let incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;

          // Store data for the current Period for the Topic
          const datasetItem = {
            // _id: topicItem._id,
            // value: topic,
            incomingBandwidth: +incomingBandwidthKbps.toFixed(2),
            outgoingBandwidth: 0,
            publishedMessages: currentPublishedData[topic].doc_count,
            deliveredMessages: 0,
            subscribedClients: 0,
            publishedClients: currentPublishedData[topic].client_published.value,
          };

          topicsData.push(datasetItem);

          // Get size
          incomingSizeBytes = previousPublishedData[topic].incoming_bandwidth.value;

          // Calculate Bandwidth the Topic
          incomingBandwidthKbps = (incomingSizeBytes * 0.001) / secondsCount;

          // Store comparison data for the current Period for the Topic
          trend[topic] = {
            incomingBandwidth: calculateTrend(
              +incomingBandwidthKbps.toFixed(2), datasetItem.incomingBandwidth
            ),
            outgoingBandwidth: calculateTrend(
              0, 0
            ),
            publishedMessages: calculateTrend(
              previousPublishedData[topic].doc_count, datasetItem.publishedMessages
            ),
            deliveredMessages: calculateTrend(
              0, 0
            ),
            subscribedClients: calculateTrend(
              0, 0
            ),
            publishedClients: calculateTrend(
              previousPublishedData[topic].client_published.value, datasetItem.publishedClients
            ),
          };

          const previous = {
            incomingBandwidth: +incomingBandwidthKbps.toFixed(2),
            publishedMessages: previousPublishedData[topic].doc_count,
            publishedClients: previousPublishedData[topic].client_published.value
          };

          console.log('trend', trend)
          console.log('datasetItem', datasetItem)
          console.log('previous', previous)
        });

        return { topicsData, trend };
      })
      .catch(error => console.log('ERROR', error));
  }
});
