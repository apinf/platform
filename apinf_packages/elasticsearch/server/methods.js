/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

// Npm packages imports
import { Client as ESClient } from 'elasticsearch';

import Proxies from '../../proxies/collection';

Meteor.methods({
  async getElasticsearchData (host, queryParams) {
    // Make sure params are String type
    check(host, String);
    check(queryParams, Object);

    // Initialize Elasticsearch client, using provided host value
    const esClient = new ESClient({ host });

    return await esClient.search(queryParams);
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
  multiSearchElasticsearch (url, content) {
    check(url, String);
    check(content, String);

    const headers = { 'Content-Type': 'application/x-ndjson' };

    return new Promise((resolve, reject) => {
      HTTP.call('GET', url, { content, headers }, (error, response) => {
        if (response.statusCode === 200) resolve(response.data.responses);
        reject(response.content);
      });
    });
  },
});
