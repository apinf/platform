/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collections imports
import AnalyticsData from '/apinf_packages/analytics/collection';
import Proxies from '/apinf_packages/proxies/collection';
import ProxyBackends from '/apinf_packages/proxy_backends/collection';

Meteor.startup(() => {
  // Get count of Analytics data records
  const analyticsData = AnalyticsData.find().count();

  // Get API_Umbrella Proxies
  const proxies = Proxies.find({ type: 'apiUmbrella' }).fetch();

  // Make sure any API Umbrella Proxy exists, any API is connected & no analytics data exists
  if (proxies.length > 0 && analyticsData === 0) {
    // get data about last 60 days
    const daysCount = 60;
    // Set the last day is "today"
    const lastDayType = 'today';

    // For each API-Umbrella proxy fill Analytics Data collection for last 30 days
    proxies.forEach(proxy => {
      // Get all proxy backends for current Proxy
      const proxyBackends = ProxyBackends.find({ proxyId: proxy._id }).fetch();

      // Make sure this proxy has at least one Proxy Backend configuration
      if (proxyBackends.length > 0) {
        // Get Elasticsearch host value
        const elasticsearchHost = proxy.apiUmbrella.elasticsearch;

        // Create filter object for query
        const proxyBackendsPrefixes = {
          filters: {},
        };

        // Create "filters" option for elasticsearch queries
        proxyBackends.forEach(backend => {
          const requestPath = backend.frontendPrefix();

          proxyBackendsPrefixes.filters[requestPath] = { prefix: { request_path: requestPath } };
        });

        // Make sync call
        // eslint-disable-next-line
        const syncCall = Meteor.call('storeAnalyticsData',
          proxyBackendsPrefixes, elasticsearchHost, daysCount, lastDayType);
      }
    });
  }

  // Get count of connected APIs to APi Umbrella proxies
  const proxyBackendsCount = ProxyBackends.find({ type: 'apiUmbrella' }).count();

  if (proxies.length > 0 && proxyBackendsCount > 0) {
    // Restart all cron tasks are related to fetching Analytics Data
    Meteor.call('restartAnalyticsDataCron');
  }
});
