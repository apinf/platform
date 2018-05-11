/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// NPM Imports
import _ from 'lodash';
import moment from 'moment';

// Collection imports
import ProxyBackends from '../../proxy_backends/collection';

// APInf imports
import overviewChartsRequest from '../lib/histogram_data';
import timelineChartsRequest from '../lib/timeline_chart';
import totalNumbersRequest from '../lib/total_numbers';
import responseStatusCodesRequest from '../lib/status_codes';
import { arrayWithZeros, generateDate } from '../lib/chart_helpers';
import { calculateTrend } from '../lib/trend_helpers';

Meteor.methods({
  async overviewChartsDataFromElasticsearch (params, proxyBackendIds) {
    check(params, Object);
    check(proxyBackendIds, Array);

    // Create a Filter by ProxyBackend frontend prefixes
    const filters = { filters: {} };

    ProxyBackends
      .find({ _id: { $in: proxyBackendIds } })
      .forEach(proxyBackend => {
        // Get Fronted prefix
        const requestPath = proxyBackend.frontendPrefix();
        // Add in Filter
        filters.filters[requestPath] = { prefix: { request_path: requestPath } };
      });

    // Fetch the first proxy backend
    const proxyBackend = ProxyBackends.findOne({ _id: { $in: proxyBackendIds } });

    // Get Elasticsearch Host
    const elasticsearchHost = proxyBackend.elasticsearchHost();

    // Build requery reqiest
    const queryBody = overviewChartsRequest(filters, params);

    // Fetch ES data
    const result = Meteor.call('getElasticsearchData', elasticsearchHost, queryBody);

    try {
      const timerange = generateDate({
        startAt: moment(params.fromDate),
        endAt: moment(params.toDate),
        format: '',
        interval: params.interval,
      });

      const response = {};

      const aggregatedData = result.aggregations.group_by_request_path.buckets;

      _.mapKeys(aggregatedData, (dataset, prefix) => {
        const requestNumber = [];
        const medianTime = [];
        const uniqueUsers = [];

        // Create a placeholders
        _.forEach(timerange, (date) => {
          requestNumber.push({ date, value: 0 });
          medianTime.push({ date, value: 0 });
          uniqueUsers.push({ date, value: 0 });
        });

        // Go through all Requested path
        _.forEach(dataset.requests_over_time.buckets, (data) => {
          // Format Date
          const currentDateValue = moment(data.key).format();
          // Find spot
          const index = timerange.indexOf(currentDateValue);
          // Replace "0" to the value
          requestNumber[index].value = data.doc_count;
          medianTime[index].value = data.percentiles_response_time.values['50.0'];
          uniqueUsers[index].value = data.unique_users.value;
        });
        response[prefix] = {
          requestNumber,
          medianTime,
          uniqueUsers,
        };
      });

      return response;
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  timelineChartDataFromElasticsearch (params) {
    check(params, Object);

    const requestPathsData = {};
    // Get Proxy backend
    const proxyBackend = ProxyBackends.findOne(params.proxyBackendId);

    // Get Elasticsearch Host
    const elasticsearchHost = proxyBackend.elasticsearchHost();

    // Get Frontend prefix
    const requestPath = proxyBackend.frontendPrefix();

    // Build query request
    const queryBody = timelineChartsRequest(requestPath, params);

    // Fetch ES data
    const result = Meteor.call('getElasticsearchData', elasticsearchHost, queryBody);
    try {
      // Process data
      const aggregatedData = result.aggregations.group_by_request_path.buckets;
      const allRequestPaths = [];

      const dates = generateDate({
        startAt: moment(params.fromDate),
        endAt: moment(params.toDate),
        format: '',
        interval: params.interval,
      });

      // If not data
      if (aggregatedData.length === 0) {
        // Add placeholder values
        allRequestPaths.push('');

        requestPathsData[''] = {
          dates,
          success: arrayWithZeros(dates.length),
          redirect: arrayWithZeros(dates.length),
          fail: arrayWithZeros(dates.length),
          error: arrayWithZeros(dates.length),
          median: arrayWithZeros(dates.length),
          percentiles95: arrayWithZeros(dates.length),
        };
      } else {
        _.forEach(aggregatedData, (dataset) => {
          // Add a request path to list
          allRequestPaths.push(dataset.key);
          // Create an Array with "0" values
          const success = arrayWithZeros(dates.length);
          const redirect = arrayWithZeros(dates.length);
          const fail = arrayWithZeros(dates.length);
          const error = arrayWithZeros(dates.length);
          const median = arrayWithZeros(dates.length);
          const percentiles95 = arrayWithZeros(dates.length);

          dataset.requests_over_time.buckets.forEach(backendData => {
            // Format Date
            const currentDateValue = moment(backendData.key).format();
            // Find spot
            const index = dates.indexOf(currentDateValue);
            // Replace "0" to the value
            success[index] = backendData.response_status.buckets.success.doc_count;
            redirect[index] = backendData.response_status.buckets.redirect.doc_count;
            fail[index] = backendData.response_status.buckets.fail.doc_count;
            error[index] = backendData.response_status.buckets.error.doc_count;
            median[index] = backendData.percentiles_response_time.values['50.0'];
            percentiles95[index] = backendData.percentiles_response_time.values['95.0'];
          });

          requestPathsData[dataset.key] = {
            dates,
            success,
            redirect,
            fail,
            error,
            median,
            percentiles95,
          };
        });
      }

      return {
        requestPathsData,
        allRequestPaths,
      };
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  totalNumberRequestFromElasticsearch (params, proxyBackendIds) {
    check(params, Object);
    check(proxyBackendIds, Array);

    if (proxyBackendIds.length === 0) {
      return [];
    }
    // Create a Filter by ProxyBackend frontend prefixes
    const filters = { filters: {} };

    ProxyBackends
      .find({ _id: { $in: proxyBackendIds } })
      .forEach(proxyBackend => {
        // Get Fronted prefix
        const requestPath = proxyBackend.frontendPrefix();
        // Add in Filter
        filters.filters[requestPath] = { prefix: { request_path: requestPath } };
      });

    // Fetch the first proxy backend
    const proxyBackend = ProxyBackends.findOne({ _id: { $in: proxyBackendIds } });
    // Get Elasticsearch Host
    const elasticsearchHost = proxyBackend.elasticsearchHost();
    // Build query request
    const queryBody = totalNumbersRequest(params, filters);

    // Fetch ES data
    const result = Meteor.call('getElasticsearchData', elasticsearchHost, queryBody);

    try {
      // Process data
      const aggregatedData = result.aggregations.group_by_request_path.buckets;
      const analyticsData = [];

      ProxyBackends
        .find({ _id: { $in: proxyBackendIds } })
        .forEach(backend => {
          const prefix = backend.frontendPrefix();

          const currentPeriod = aggregatedData[prefix].by_period.buckets.current;
          const previousPeriod = aggregatedData[prefix].by_period.buckets.previous;

          analyticsData.push({
            prefix,
            apiName: backend.apiName(),
            apiSlug: backend.apiSlug(),
            proxyBackendId: backend._id,
            requestNumber: currentPeriod.doc_count,
            medianResponseTime: parseFloat(currentPeriod.median_response_time.values['50.0']) || 0,
            avgUniqueUsers: currentPeriod.unique_users.value,
            compareRequests: calculateTrend(previousPeriod.doc_count,
              currentPeriod.doc_count),
            compareResponse: calculateTrend(previousPeriod.median_response_time.values['50.0'],
              currentPeriod.median_response_time.values['50.0']),
            compareUsers: calculateTrend(previousPeriod.unique_users.value,
              currentPeriod.unique_users.value),
          });
        });

      if (params.responseCode) {
        // Get data for Success & Error calls
        // Build query request
        const bodyRequest = responseStatusCodesRequest(params, filters);

        // Fetch ES data
        const statusCodes = Meteor.call('getElasticsearchData', elasticsearchHost, bodyRequest);

        const aggsData = statusCodes.aggregations.group_by_request_path.buckets;

        analyticsData.forEach(dataset => {
          const bucket = aggsData[dataset.prefix].response_status.buckets;
          dataset.successCallsCount = bucket.success.doc_count;
          dataset.errorCallsCount = bucket.fail.doc_count;
        });
      }
      return analyticsData;
    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },
  statusCodesFromElasticsearch (params) {
    check(params, Object);

    // Get Proxy backend
    const proxyBackend = ProxyBackends.findOne(params.proxyBackendId);

    // Get Elasticsearch Host
    const elasticsearchHost = proxyBackend.elasticsearchHost();

    // Get Frontend prefix
    const requestPath = proxyBackend.frontendPrefix();

    const filters = { filters: { [requestPath]: { prefix: { request_path: requestPath } } } };

    // Build query request
    const bodyRequest = responseStatusCodesRequest(params, filters);

    // Fetch ES data
    const statusCodes = Meteor.call('getElasticsearchData', elasticsearchHost, bodyRequest);

    const aggsData = statusCodes.aggregations.group_by_request_path.buckets;
    const bucket = aggsData[requestPath].response_status.buckets;

    return {
      [requestPath]: {
        successCallsCount: bucket.success.doc_count,
        redirectCallsCount: bucket.redirect.doc_count,
        failCallsCount: bucket.fail.doc_count,
        errorCallsCount: bucket.error.doc_count,
      },
    };
  },
});
