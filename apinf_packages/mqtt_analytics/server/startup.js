/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Collections imports
import EmqAnalyticsData from '/apinf_packages/mqtt_analytics/collection';
import Proxies from '/apinf_packages/proxies/collection';
import StoredTopics from '../../mqtt_dashboard/collection';

Meteor.startup(() => {
  // Get count of Analytics data records
  const analyticsData = EmqAnalyticsData.find().count();

  // Get EMQ Proxy
  const proxy = Proxies.findOne({ type: 'emq' });

  const topics = StoredTopics.find().fetch();

  // Make sure EMQ Proxy exists, any Topic is stored & no analytics data exists
  if (proxy && topics.length > 0 && analyticsData === 0) {
    // get data about last 60 days
    const daysCount = 60;
    // get data about last 48 hours
    const hoursCount = 48;
    // Set the last day is "today"
    const lastDayType = 'today';

    // Make sync call
    // eslint-disable-next-line
    const syncCall = Meteor.call('emqAnalyticsData',
      proxy._id, daysCount, hoursCount, lastDayType);
  }

  if (proxy && topics.length > 0) {
    // Restart all cron tasks are related to fetching EMQ Analytics Data
    // Meteor.call('restartEmqAnalyticsDataCron');
  }
});
