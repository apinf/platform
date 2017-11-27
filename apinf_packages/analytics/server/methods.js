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
import { calculateTrend } from '/apinf_packages/dashboard/lib/trend_helpers';
import aggregatedData from '../../analytics/server/query';

Meteor.methods({
  timelineChartData (filter) {
    check(filter, Object);

    const requestPathsData = {};

    // Get list of all requested path of particular Proxy Backend
    const allPathsMatrix = AnalyticsData.find(
      { proxyBackendId: filter.proxyBackendId,
        date: { $gte: filter.fromDate, $lt: filter.toDate },
      }).map(data => {
        return data.allRequestPaths;
      });

    // Transform Array of Arrays to List
    // 1. Get not empty array
    // 2. Join all array into one String with "," as separator
    // 3. Convert string to Array using "," as separator
    const allPathsList = allPathsMatrix.filter(paths => {
      return paths.length > 0;
    }).join().split(',');

    // Keep only unique paths
    const uniquePathsList = [...new Set(allPathsList)];

    AnalyticsData.aggregate(
      [
        {
          $match: {
            date: { $gte: filter.fromDate, $lt: filter.toDate },
            proxyBackendId: filter.proxyBackendId,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
        {
          $group: {
            // Group by paths
            _id: { paths: uniquePathsList },
            success: { $push: { date: '$date', value: '$requestPathsData.successCallsCount' } },
            redirect: { $push: { date: '$date', value: '$requestPathsData.redirectCallsCount' } },
            fail: { $push: { date: '$date', value: '$requestPathsData.failCallsCount' } },
            error: { $push: { date: '$date', value: '$requestPathsData.errorCallsCount' } },
            medianTime: { $push: { date: '$date', value: '$requestPathsData.medianResponseTime' } },
            percentiles95Time: { $push: {
              date: '$date',
              value: '$requestPathsData.percentile95ResponseTime',
            } },
          },
        },
      ]
    ).forEach(dataset => {
      /* eslint-disable arrow-body-style */
      dataset._id.paths.forEach((path, index) => {
        // Fill data for each request path
        requestPathsData[path] = {
          dates: dataset.success.map(x => x.date),
          success: dataset.success.map(x => x.value[index] || 0),
          redirect: dataset.redirect.map(x => x.value[index] || 0),
          fail: dataset.fail.map(x => x.value[index] || 0),
          error: dataset.error.map(x => x.value[index] || 0),
          median: dataset.medianTime.map(x => x.value[index] || 0),
          percentiles95: dataset.percentiles95Time.map(x => x.value[index] || 0),
        };
      });
      /* eslint-enable arrow-body-style */
    });

    return { allRequestPaths: uniquePathsList, requestPathsData };
  },
  errorsStatisticsData (filter) {
    check(filter, Object);

    let errors = [];

    // Fetch all data for Errors table
    AnalyticsData.find(
      { date: { $gte: filter.fromDate, $lt: filter.toDate },
        proxyBackendId: filter.proxyBackendId,
        errors: { $ne: [] } },
      { sort: { date: -1 } }
    ).forEach(data => {
      // Convert
      errors = errors.concat(data.errors);
    });

    return errors;
  },
  summaryStatisticNumber (filter) {
    check(filter, Object);

    // Create query to $match
    const matchQuery = {
      date: { $gte: filter.fromDate, $lt: filter.toDate },
    };

    if (filter.proxyId) {
      // Fetch data for particular Proxy (and several Proxy Backends)
      matchQuery.proxyId = filter.proxyId;
    } else {
      // Fetch data for particular Proxy Backend
      matchQuery.proxyBackendId = filter.proxyBackendId;
    }

    const requestPathsData = {};

    AnalyticsData.aggregate(
      [
        {
          $match: matchQuery,
        },
        {
          $sort: {
            date: 1,
          },
        },
        {
          $group: {
            _id: '$prefix',
            requestNumber: { $sum: '$requestNumber' },
            sumMedianTime: { $sum: '$medianResponseTime' },
            sumUniqueUsers: { $sum: '$uniqueUsers' },
            successCallsCount: { $sum: '$successCallsCount' },
            redirectCallsCount: { $sum: '$redirectCallsCount' },
            failCallsCount: { $sum: '$failCallsCount' },
            errorCallsCount: { $sum: '$errorCallsCount' },
          },
        },
      ]
    ).forEach(dataset => {
      // Create query
      const query = { prefix: dataset._id, date: matchQuery.date, requestNumber: { $ne: 0 } };

      if (filter.proxyId) {
        query.proxyId = filter.proxyId;
      } else {
        query.proxyBackendId = filter.proxyBackendId;
      }

      // Get the number of date when requests were
      const existedValuesCount = AnalyticsData.find(query).count();

      // Calculate average (mean) value of Response time and Uniques users during period
      requestPathsData[dataset._id] = {
        medianResponseTime: parseInt(dataset.sumMedianTime / existedValuesCount, 10) || 0,
        avgUniqueUsers: parseInt(dataset.sumUniqueUsers / existedValuesCount, 10) || 0,
      };

      Object.assign(requestPathsData[dataset._id], dataset);
    });

    return requestPathsData;
  },
  summaryStatisticTrend (filter, currentPeriodResponse) {
    check(filter, Object);
    check(currentPeriodResponse, Object);

    // Get summary statistic data about previous period
    const previousPeriodResponse = Meteor.call('summaryStatisticNumber', filter);

    const comparisonData = {};

    // Compare the current and previous periods data
    _.mapKeys(currentPeriodResponse, (dataset, path) => {
      const previousPeriodData = previousPeriodResponse[path] || {};

      comparisonData[path] = {
        compareRequests: calculateTrend(previousPeriodData.requestNumber, dataset.requestNumber),
        compareResponse:
          calculateTrend(previousPeriodData.medianResponseTime, dataset.medianResponseTime),
        compareUsers: calculateTrend(previousPeriodData.avgUniqueUsers, dataset.avgUniqueUsers),
      };
    });

    return comparisonData;
  },
  statusCodesData (filter) {
    check(filter, Object);

    // Create query to $match
    const matchQuery = {
      date: { $gte: filter.fromDate, $lt: filter.toDate },
    };

    if (filter.proxyId) {
      // Fetch data for particular Proxy (and several Proxy Backends)
      matchQuery.proxyId = filter.proxyId;
    } else {
      // Fetch data for particular Proxy Backend
      matchQuery.proxyBackendId = filter.proxyBackendId;
    }

    const requestPathsData = {};

    AnalyticsData.aggregate(
      [
        {
          $match: matchQuery,
        },
        {
          $sort: {
            date: 1,
          },
        },
        {
          $group: {
            _id: '$prefix',
            successCallsCount: { $sum: '$successCallsCount' },
            redirectCallsCount: { $sum: '$redirectCallsCount' },
            failCallsCount: { $sum: '$failCallsCount' },
            errorCallsCount: { $sum: '$errorCallsCount' },
          },
        },
      ]
    ).forEach(dataset => {
      requestPathsData[dataset._id] = dataset;
    });

    return requestPathsData;
  },
  overviewChartsData (filter) {
    // Return aggregated data for overview charts
    check(filter, Object);

    const matchQuery = {
      date: { $gte: filter.fromDate, $lt: filter.toDate },
    };

    if (filter.proxyId) {
      // Fetch data for particular Proxy (and several Proxy Backends)
      matchQuery.proxyId = filter.proxyId;
    } else {
      // Fetch data for particular Proxy Backend
      matchQuery.proxyBackendId = filter.proxyBackendId;
    }

    const requestPathsData = {};

    AnalyticsData.aggregate(
      [
        {
          $match: matchQuery,
        },
        {
          $sort: {
            date: 1,
          },
        },
        {
          $group: {
            _id: '$prefix',
            requestNumber: { $push: { date: '$date', value: '$requestNumber' } },
            medianTime: { $push: { date: '$date', value: '$medianResponseTime' } },
            uniqueUsers: { $push: { date: '$date', value: '$uniqueUsers' } },
          },
        },
      ]
    ).forEach(dataset => {
      requestPathsData[dataset._id] = dataset;
    });

    return requestPathsData;
  },
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
          [requestPath]: { prefix: { request_path: requestPath } },
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

        // Try to get analytics data for current day and cu
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
});
