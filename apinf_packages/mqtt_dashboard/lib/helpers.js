/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import moment from 'moment/moment';

export function getDateRange (timeframe) {
  let interval;
  let tomorrow;
  let subtractInterval;

  // Get current time
  const today = moment().valueOf();

  switch (timeframe) {
    case '1': {
      interval = 'minute';
      subtractInterval = 'hour';
      // Add to range the next minute (excluded border)
      tomorrow = today;
      break;
    }
    case '24': {
      interval = 'hour';
      subtractInterval = 'hour';
      // Add to range the next hour (excluded border)
      tomorrow = moment(today).add(1, 'h').valueOf();
      break;
    }
    default: {
      interval = 'day';
      subtractInterval = 'day';
      // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
      tomorrow = moment(0, 'HH').add(1, 'd').valueOf();
    }
  }

  const startDay = moment(tomorrow).subtract(timeframe, subtractInterval).valueOf();
  const doublePeriodAgo = moment(startDay).subtract(timeframe, subtractInterval).valueOf();

  return {
    doublePeriodAgo,
    onePeriodAgo: startDay,
    from: startDay,
    to: tomorrow,
    interval,
  };
}

export function publishedClients (elasticsearchData, date) {
  // no data
  if (elasticsearchData.length === 0) {
    // Return the null data
    return [{
      doc_count: 0,
      key: date,
    }];
  }

  return elasticsearchData.map(dataset => {
    return {
      // Get data
      key: dataset.key,
      // get count of unique users
      doc_count: dataset.client_publish.value,
    };
  });
}

export function calculateSecondsCount (timeframe) {
  switch (timeframe) {
    // Last 1 hour
    case '1': {
      return 60 * 60;
    }
    // Last 24 hours
    case '24': {
      return 60 * 60 * 24;
    }
    // Last 7 days
    case '7': {
      return 60 * 60 * 24 * 7;
    }
    // Last 30 days
    default: {
      return 60 * 60 * 24 * 30;
    }
  }
}
