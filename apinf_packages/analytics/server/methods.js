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

// APInf imports
import { calculateTrend } from '/apinf_packages/dashboard/lib/trend_helpers';

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
            shortest: { $push: { date: '$date', value: '$requestPathsData.shortestResponseTime' } },
            short: { $push: { date: '$date', value: '$requestPathsData.shortResponseTime' } },
            long: { $push: { date: '$date', value: '$requestPathsData.longResponseTime' } },
            longest: { $push: { date: '$date', value: '$requestPathsData.longestResponseTime' } },
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
          shortest: dataset.shortest.map(x => x.value[index] || 0),
          short: dataset.short.map(x => x.value[index] || 0),
          long: dataset.long.map(x => x.value[index] || 0),
          longest: dataset.longest.map(x => x.value[index] || 0),
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
  summaryStatisticNumber (filter, proxyBackendIds) {
    check(filter, Object);
    check(proxyBackendIds, Array);

    // Create query to $match
    const matchQuery = {
      date: { $gte: filter.fromDate, $lt: filter.toDate },
      proxyBackendId: { $in: proxyBackendIds },
    };

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
            sumLongestResponseTime: { $sum: '$longestResponseTime' },
            sumLongResponseTime: { $sum: '$longResponseTime' },
            sumShortestResponseTime: { $sum: '$shortestResponseTime' },
            sumShortResponseTime: { $sum: '$shortResponseTime' },
            sumUniqueUsers: { $sum: '$uniqueUsers' },
            successCallsCount: { $sum: '$successCallsCount' },
            errorCallsCount: { $sum: '$errorCallsCount' },
          },
        },
      ]
    ).forEach(dataset => {
      // Expend query
      matchQuery.prefix = dataset._id;
      matchQuery.requestNumber = { $ne: 0 };

      // Get the number of date when requests were no 0
      const existedValuesCount = AnalyticsData.find(matchQuery).count();

      // Calculate average (mean) value of Response time and Uniques users during period
      requestPathsData[dataset._id] = {
        prefix: dataset._id, // Just rename it
        medianResponseTime:
          parseInt(dataset.sumMedianTime / existedValuesCount, 10) || 0,
        longestResponseTime:
          parseInt(dataset.sumLongestResponseTime / existedValuesCount, 10) || 0,
        longResponseTime:
          parseInt(dataset.sumLongResponseTime / existedValuesCount, 10) || 0,
        shortestResponseTime:
          parseInt(dataset.sumShortestResponseTime / existedValuesCount, 10) || 0,
        shortResponseTime:
          parseInt(dataset.sumShortResponseTime / existedValuesCount, 10) || 0,
        avgUniqueUsers:
          parseInt(dataset.sumUniqueUsers / existedValuesCount, 10) || 0,
      };

      Object.assign(requestPathsData[dataset._id], dataset);
    });

    return requestPathsData;
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
            shortest: { $push: { date: '$date', value: '$shortestResponseTime' } },
            short: { $push: { date: '$date', value: '$shortResponseTime' } },
            long: { $push: { date: '$date', value: '$longResponseTime' } },
            longest: { $push: { date: '$date', value: '$longestResponseTime' } },

            uniqueUsers: { $push: { date: '$date', value: '$uniqueUsers' } },
          },
        },
      ]
    ).forEach(dataset => {
      requestPathsData[dataset._id] = dataset;
    });

    return requestPathsData;
  },
  totalNumberRequestsAndTrend (filter, proxyBackendIds) {
    check(filter, Object);
    check(proxyBackendIds, Array);

    // Get data for Current period
    const currentPeriodResponse =
      Meteor.call('summaryStatisticNumber', filter, proxyBackendIds);

    // Create date range filter for Previous period
    const previousPeriodFilter = {
      fromDate: filter.doublePeriodAgo,
      toDate: filter.onePeriodAgo,
    };

    // Get data for Previous period
    const previousPeriodResponse =
      Meteor.call('summaryStatisticNumber', previousPeriodFilter, proxyBackendIds);

    const response = [];

    // Compare the current and previous periods data
    _.mapKeys(currentPeriodResponse, (dataset, path) => {
      const proxyBackend = ProxyBackends.findOne({
        'apiUmbrella.url_matches.frontend_prefix': dataset.prefix,
      });

      if (proxyBackend) {
        dataset.proxyBackendId = proxyBackend._id;
        dataset.apiName = proxyBackend.apiName();
        dataset.apiSlug = proxyBackend.apiSlug();
        dataset.apiId = proxyBackend.apiId;

        // Create a comparison data
        const previousPeriodData = previousPeriodResponse[path] || {};
        dataset.compareRequests =
          calculateTrend(previousPeriodData.requestNumber, dataset.requestNumber);
        dataset.compareResponse =
          calculateTrend(previousPeriodData.medianResponseTime, dataset.medianResponseTime);
        dataset.compareUsers =
          calculateTrend(previousPeriodData.avgUniqueUsers, dataset.avgUniqueUsers);

        response.push(dataset);
      }
    });
    return response;
  },
});
