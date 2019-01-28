/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// NPM imports
import _ from 'lodash';

// APInf imports
import promisifyCall from '../../core/helper_functions/promisify_call';
import { autoCompleteRequest } from '../lib/topics_requests';
import { indexesSet } from '../lib/helpers';
import Settings from '/apinf_packages/settings/collection';

Meteor.methods({
  buildRequestAutocomplete (topic) {
    check(topic, String);

    // Build index for each event type
    const indexName = indexesSet('1', 'message_published', 'current');

    // Build query body for each event type
    const queryBody = autoCompleteRequest(topic);

    let url;

    const settings = Settings.findOne();

    // If the access permission 'only admins can add APIs' is defined, use it
    if (settings && settings.esDashboardData && settings.esDashboardData.enabled) {
      // Make sure current user is admin
      url = settings.esDashboardData.request;
    }

    const content =
      `{"index" : "${indexName}", "ignoreUnavailable": true}\n${queryBody}\n`;

    // Send request to ES
    return promisifyCall('multiSearchElasticsearch', url, content);
  },
  autocompletedDataFetch (response, searchedTopic) {
    check(response, Array);
    check(searchedTopic, String);

    try {
      const topicsData = response[0].aggregations.topic_value.buckets;

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
