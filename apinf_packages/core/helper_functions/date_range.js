/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import moment from 'moment';

export default function getDateRange (timeframe) {
  let interval;
  let tomorrow;
  let subtractInterval;
  let subtractValue = timeframe;

  // Get current time
  const today = moment().valueOf();

  switch (timeframe) {
    // Last 1 hour
    case '1': {
      interval = 'minute';
      subtractInterval = 'hour';
      // Add to range the next minute (excluded border)
      tomorrow = today;
      break;
    }
    // From midnight to now (Today)
    case '12': {
      const nextHourTime = moment(today).add(1, 'h').minute(0).second(0);
      // Add to range the next hour (excluded value)
      tomorrow = nextHourTime.valueOf();
      // Subtract a 1 Day
      subtractInterval = 'hour';
      // Calculate how much hours past from midnight
      subtractValue = moment(tomorrow).diff(moment(0, 'H'), 'h');
      interval = 'hour';
      break;
    }
    // Last 24 hours
    case '24': {
      interval = 'hour';
      subtractInterval = 'hour';
      // Add to range the next hour (excluded border)
      tomorrow = moment(today).add(1, 'h').valueOf();
      break;
    }
    // Yesterday
    case '48': {
      // Subtract a 1 Day
      subtractInterval = 'day';
      subtractValue = 1;
      // "Midnight" (excluded border)
      tomorrow = moment(0, 'HH').valueOf();
      // Aggregated data by hour
      interval = 'hour';
      break;
    }
    // Last N days
    default: {
      interval = 'day';
      subtractInterval = 'day';
      // Get timestamp of tomorrow 00:00:00 Date time (excluded value)
      tomorrow = moment(0, 'HH').add(1, 'd').valueOf();
    }
  }

  const startDay = moment(tomorrow).subtract(subtractValue, subtractInterval).valueOf();
  const doublePeriodAgo = moment(startDay).subtract(subtractValue, subtractInterval).valueOf();

  return {
    doublePeriodAgo,
    onePeriodAgo: startDay,
    from: startDay,
    to: tomorrow,
    interval,
  };
}
