/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Collections imports
import AnalyticsData from '/apinf_packages/analytics/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

// Npm packages imports
import moment from 'moment';
import _ from 'lodash';

// APInf imports
import aggregatedData from '../../analytics/server/query';

Meteor.methods({
  proxyBackendAnalyticsData (proxyBackendId, daysCount, lastDayType) {
    check(proxyBackendId, String);
    check(daysCount, Number);
    check(lastDayType, String);

    // Get proxy backend
    const proxyBackend = ProxyBackends.findOne(proxyBackendId);

    // make sure Proxy Backend exists
    if (proxyBackend) {
      const requestPath = proxyBackend.frontendPrefix();

      const proxyBackendFilter = {
        filters: {
          [requestPath]: { prefix: { request_path: requestPath.toLowerCase() } },
        },
      };

      const proxy = Proxies.findOne(proxyBackend.proxyId);

      if (proxy) {
        // Get elasticsearchHost
        const elasticsearchHost = proxy.apiUmbrella.elasticsearch;

        Meteor.call('storeAnalyticsData',
          proxyBackendFilter, elasticsearchHost, daysCount, lastDayType
        );
      } else {
        throw new Meteor.Error(`No Proxy exists with provided id ${proxyBackend.proxyId}`);
      }
    } else {
      throw new Meteor.Error(`No Proxy Backend exists with provided id ${proxyBackendId}`);
    }
  },
  storeAnalyticsData (prefixFilter, elasticsearchHost, daysCount, lastDaytype) {
    check(prefixFilter, Object);
    check(elasticsearchHost, String);
    check(daysCount, Number);
    check(lastDaytype, String);

    let lastDay;

    // Get timestamp of tomorrow date that will be the highest day.
    if (lastDaytype === 'today') {
      // Include "today" day in date range
      lastDay = moment(0, 'HH').add(1, 'd').valueOf();
    } else {
      // Do not include "today" day in date range
      lastDay = moment(0, 'HH').valueOf();
    }

    // Take last daysCount days
    for (let i = 0; i < daysCount; i++) {
      // Get timestamp of upper date range interval (excluded value)
      const toDate = moment(lastDay).subtract(i, 'd').valueOf();
      // Get timestamp of lower date range interval (included value)
      const fromDate = moment(lastDay).subtract(i + 1, 'd').valueOf();
      // Get human readable format
      const dateAsString = moment(fromDate).format('MM-DD-YYYY');

      // Create the query to ElasticSearch
      const query = aggregatedData(prefixFilter, fromDate, toDate);

      // Create a cursor for Bulk operation
      const bulk = AnalyticsData.rawCollection().initializeUnorderedBulkOp();

      // Send request to ElasticSearch. Sync call
      const response = Meteor.call('getElasticsearchData', elasticsearchHost, query);

      // Get data that are grouped by requested path
      const aggregatedDataResponse = response.aggregations.group_by_request_path.buckets;

      _.mapKeys(aggregatedDataResponse, (analyticsData, frontedPrefix) => {
        // Initialize
        const allRequestPaths = [];
        const errors = [];

        // Get related Proxy Backend instance to take info about _id and proxyId
        const proxyBackend = ProxyBackends.findOne({
          'apiUmbrella.url_matches.0.frontend_prefix': frontedPrefix,
        });

        // Try to get analytics data for current day and current proxy backend
        const dataForCurrentDate = AnalyticsData.findOne({
          date_as_string: dateAsString,
          proxyBackendId: proxyBackend._id,
        });

        // Summary statistics block
        // Store data about summary statistic numbers
        const requestNumber = analyticsData.requests_number.value;
        const medianResponseTime = analyticsData.median_response_time.values['50.0'];
        const uniqueUsers = analyticsData.unique_users.buckets.length;

        // Store data about summary response status codes
        const responseStatusCode = analyticsData.response_status.buckets;

        // Timeline charts block
        // Get details about requested paths
        const requestPaths = analyticsData.request_paths.buckets;

        // Detailed analytics data about each requested path
        const requestPathsData = requestPaths.map(dataset => {
          // Create a list to store all requested paths in one field
          allRequestPaths.push(dataset.key);

          // Get data about response status codes
          const statusCodes = dataset.response_status.buckets;
          // Get data about response time in dimension
          const percentile50ResponseTime = dataset.percentiles_response_time.values['50.0'];
          const percentile95ResponseTime = dataset.percentiles_response_time.values['95.0'];

          return {
            requestPath: dataset.key,
            successCallsCount: statusCodes.success.doc_count,
            redirectCallsCount: statusCodes.redirect.doc_count,
            failCallsCount: statusCodes.fail.doc_count,
            errorCallsCount: statusCodes.error.doc_count,
            medianResponseTime: parseInt(percentile50ResponseTime, 10) || 0,
            percentile95ResponseTime: parseInt(percentile95ResponseTime, 10) || 0,
          };
        });

        // Errors table block
        // Get data about errors status codes
        const errorsStatistic = analyticsData.errors_statistics.request_path;

        errorsStatistic.buckets.forEach(dataset => {
          // Get data about status codes of particular request path
          const responseStatusCodes = dataset.response_status.buckets;

          responseStatusCodes.forEach(status => {
            // Store detailed data
            errors.push({
              date: fromDate,
              // Get value of particular request path
              requestPath: dataset.key,
              // Get value of request code status
              status: status.key,
              // Get value of request number
              calls: status.doc_count,
            });
          });
        });

        let markedDate = fromDate;

        if (daysCount === 1 && lastDaytype === 'today') {
          markedDate = moment().valueOf();
        }

        const data = {
          proxyId: proxyBackend.proxyId,
          proxyBackendId: proxyBackend._id,
          date: markedDate,
          date_as_string: dateAsString,
          prefix: frontedPrefix,
          requestNumber,
          medianResponseTime: parseInt(medianResponseTime, 10) || 0,
          uniqueUsers,
          successCallsCount: responseStatusCode.success.doc_count,
          redirectCallsCount: responseStatusCode.redirect.doc_count,
          failCallsCount: responseStatusCode.fail.doc_count,
          errorCallsCount: responseStatusCode.error.doc_count,
          allRequestPaths,
          requestPathsData,
          errors,
        };

        if (dataForCurrentDate) {
          bulk.find({
            date_as_string: dateAsString, proxyBackendId: proxyBackend._id,
          }).update({ $set: data });
        } else {
          bulk.insert(data);
        }
      });

      // Execute all insert operation
      bulk.execute();
    }
  },
  lastUpdateTime (query) {
    check(query, Object);

    // Take the particular ProxyBackend Id. Sort by date desc and take one record
    const analytics = AnalyticsData.findOne(query, { sort: { date: -1 }, limit: 1 });
    // Return "date" value
    return analytics && analytics.date;
  },
  getServerTimeZone () {
    const serverTime = new Date();
    const timeZone = serverTime.toString().substring(25);
    return timeZone;
  },
});
