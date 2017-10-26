/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import Apis from '/apinf_packages/apis/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';
import Organizations from '/apinf_packages/organizations/collection';
import OrganizationApis from '/apinf_packages/organization_apis/collection';

// APInf imports
import { calculateTrend } from '/apinf_packages/dashboard/lib/trend_helpers';
import promisifyCall from '/apinf_packages/core/helper_functions/promisify_call';

Meteor.methods({
  getProxiesList (type) {
    // Make sure the parameter is String type
    check(type, String);

    // Return proxies list with specified type
    return Proxies.find({ type }).fetch();
  },
  proxyBackendExists (apiSlug) {
    check(apiSlug, String);

    // Get API
    const api = Apis.findOne({ slug: apiSlug });

    let proxyBackend;

    // Make sure API exists
    if (api) {
      // Get related Proxy Backend configuretion
      proxyBackend = ProxyBackends.findOne({ apiId: api._id });
    }

    return proxyBackend;
  },
  userCanViewAnalytic (apiId) {
    // Make sure apiId is a string
    check(apiId, String);

    // Get API
    const api = Apis.findOne(apiId);

    // Check if user can edit
    return api && api.currentUserCanManage();
  },
  myApisIds () {
    // Get APIs are managed by current user
    const myApis = Apis.find({ managerIds: { $in: [this.userId] } }, { _id: 1 }).fetch();

    // Return list of IDs
    return myApis.map(api => {
      return api._id;
    });
  },
  managedApisIds (myApis) {
    // Make sure parameter exists and is Array
    check(myApis, Array);

    // Get Organizations which are managed by current user
    const managedOrganizations = Organizations.find(
      { managerIds: { $in: [this.userId] } },
      { _id: 1 }
    ).fetch();

    // Make list of IDs
    const organizationIds = managedOrganizations.map(organization => {
      return organization._id;
    });

    // Get relations of organizations
    const organizationApis = OrganizationApis.find(
      { organizationId: { $in: organizationIds } },
      { apiId: 1 }
    ).fetch();

    // Make list of IDs
    const apiIds = organizationApis.map(organizationApi => {
      return organizationApi.apiId;
    });

    // Get managed APIs of Organizations and no owned
    const managedApis = Apis.find({ _id: { $in: apiIds, $nin: myApis } }, { _id: 1 }).fetch();

    // Return list of IDs
    return managedApis.map(api => {
      return api._id;
    });
  },
  otherApisIds (myApis, managedApis) {
    // Check parameters are array
    check(myApis, Array);
    check(managedApis, Array);

    // Get APIs which are not managed by current user
    // And are not connected to Organizations which the current user is manager
    const otherApis = Apis.find({ _id: { $nin: myApis.concat(managedApis) } }, { _id: 1 }).fetch();

    // Return list of IDs
    return otherApis.map(api => {
      return api._id;
    });
  },
  groupingApiIds () {
    // Placeholder to store ids
    const groupingIds = {
      myApis: [],
      managedApis: [],
      otherApis: [],
    };

    // Get IDs of owned APIs
    groupingIds.myApis = Meteor.call('myApisIds');
    // Get IDs of managed APIs
    groupingIds.managedApis = Meteor.call('managedApisIds', groupingIds.myApis);

    // Make sure user is admin
    if (Roles.userIsInRole(this.userId, ['admin'])) {
      // Get IDs of other APIs
      groupingIds.otherApis = Meteor.call('otherApisIds',
        groupingIds.myApis, groupingIds.managedApis
      );
    }

    // Return all lists of IDs
    return groupingIds;
  },
  dashboardChartData (host, queryParams) {
    // Make sure params are String type
    check(host, String);
    check(queryParams, Object);

    // Fetch data from elasticsearch
    return promisifyCall('getElasticsearchData', host, queryParams)
      // Prepare dataset for charts and table with trend
      .then((result) => {
        // Get bucket of aggregated data
        const buckets = result.aggregations.group_by_request_path.buckets;

        return buckets.map(value => {
          const currentPeriodData = value.group_by_interval.buckets.currentPeriod;

          // Get the statistic for current period
          const requestNumber = currentPeriodData.doc_count;
          const responseTime = parseInt(currentPeriodData.response_time.values['50.0'], 10) || 0;
          const uniqueUsers = currentPeriodData.unique_users.buckets.length;
          const successCallsCount = currentPeriodData.success_status.buckets.success.doc_count;
          const errorCallsCount = currentPeriodData.success_status.buckets.error.doc_count;

          const previousPeriodData = value.group_by_interval.buckets.previousPeriod;
          const previousResponseTime = previousPeriodData.response_time.values['50.0'];
          const previousUniqueUsers = previousPeriodData.unique_users.buckets.length;

          // Get the statistics comparing between previous and current periods
          const compareRequests = calculateTrend(previousPeriodData.doc_count, requestNumber);
          const compareResponse = calculateTrend(parseInt(previousResponseTime, 10), responseTime);
          const compareUsers = calculateTrend(previousUniqueUsers, uniqueUsers);

          // Get value to display
          return {
            requestPath: value.key,
            requestNumber,
            responseTime,
            uniqueUsers,
            successCallsCount,
            errorCallsCount,
            requestOverTime: currentPeriodData.requests_over_time.buckets,
            compareRequests,
            compareResponse,
            compareUsers,
          };
        });
      }).catch((error) => {
        throw new Meteor.Error(error);
      });
  },
});
