/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Meteor contributed packages imports
import { SyncedCron } from 'meteor/percolate:synced-cron';

// Collection imports
import ProxyBackends from '/apinf_packages/proxy_backends/collection/index';

Meteor.methods({
  calculateAnalyticsData (proxyBackendId) {
    // Make sure proxyBackendId is a String
    check(proxyBackendId, String);

    // Create unique name for Cron job
    const todayAnalytics = `Analytics data: ${proxyBackendId}`;

    // Start this cron task every 30 minutes
    const todayCronTime = 'every 30 mins';

    // Create cron working
    SyncedCron.add({
      name: todayAnalytics,
      schedule (parser) {
        // parser is a later.parse object
        return parser.text(todayCronTime);
      },
      job () {
        // Get data about one day
        const daysCount = 1;
        // Set the last day is "today"
        const lastDayType = 'today';

        // Store analytics data in MongoDB
        Meteor.call('proxyBackendAnalyticsData', daysCount, proxyBackendId, lastDayType);
      },
    });

    // Create unique name for Cron job
    const yesterdayAnalytics = `Analytics data during yesterday: ${proxyBackendId}`;

    // Start this cron task at 1:15 am
    const yesterdayCronTime = 'at 1:15 am';

    // Create cron working
    SyncedCron.add({
      name: yesterdayAnalytics,
      schedule (parser) {
        // parser is a later.parse object
        return parser.text(yesterdayCronTime);
      },
      job () {
        // Get data about one day
        const daysCount = 1;
        // Set the last day is "yesterday"
        const lastDayType = 'yesterday';

        // Store analytics data in MongoDB
        Meteor.call('proxyBackendAnalyticsData', daysCount, proxyBackendId, lastDayType);
      },
    });
  },
  stopCalculateAnalyticsData (proxyBackendId) {
    // Make sure proxyBackendId is a String
    check(proxyBackendId, String);

    // Create unique name for Cron job
    const yesterdayAnalytics = `Analytics data during yesterday: ${proxyBackendId}`;

    // Stop Cron job
    SyncedCron.remove(yesterdayAnalytics);

    // Create unique name for Cron job
    const todayAnalytics = `Analytics data: ${proxyBackendId}`;

    // Stop Cron job
    SyncedCron.remove(todayAnalytics);
  },
  restartAnalyticsDataCron () {
    // Get all proxy backends are connected to API-Umbrella proxies
    const proxyBackends = ProxyBackends.find({ type: 'apiUmbrella' }).fetch();

    proxyBackends.forEach(proxyBackend => {
      Meteor.call('calculateAnalyticsData', proxyBackend._id);
    });
  },
});
