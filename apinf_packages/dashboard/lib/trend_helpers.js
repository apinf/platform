/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages import
import { TAPi18n } from 'meteor/tap:i18n';

export function arrowDirection (parameter, bucket) {
  let positiveTrend = 'trending-up arrow-up';
  let negativeTrend = 'trending-down arrow-down';
  let comparison;

  switch (parameter) {
    case 'requests':
      comparison = bucket.compareRequests;
      break;

    case 'time':
      comparison = bucket.compareResponse;
      positiveTrend = 'trending-up arrow-up_time';
      negativeTrend = 'trending-down arrow-down_time';
      break;

    case 'users':
      comparison = bucket.compareUsers;
      break;

    default:
      comparison = 0;

  }

  // If there is no trend
  if (comparison === 0 || comparison === undefined) {
    // Don't display an arrow indicating
    return 'no-trend';
  }

  // If there is a positive trend
  if (comparison > 0) {
    // Display a green up arrow or a green down for response time metric
    return positiveTrend;
  }

  // If there is a negative trend
  // Display a red down arrow or a red up for response time metric
  return negativeTrend;
}

export function percentageValue (parameter, bucket) {
  let comparison;

  switch (parameter) {
    case 'requests':
      comparison = bucket.compareRequests;
      break;
    case 'time':
      comparison = bucket.compareResponse;
      break;
    case 'users':
      comparison = bucket.compareUsers;
      break;
    default:
      comparison = 0;
      break;
  }

  // Get absolute value of comparison
  const percentage = Math.abs(comparison);

  // Don't display 0%
  return percentage > 0 ? `${percentage}%` : '';
}

export function calculateTrend (previous, current) {
  // If values are equal
  // then no up-down
  if (previous === current) return 0;

  // If no data was in previous period and an empty value in current period
  // then no up-down
  if (isNaN(previous) && current === 0) return 0;

  // it is impossible to divide on 0
  // If previous value is 0 then progress is up on 100%
  if (previous === 0 || isNaN(previous)) return 100;

  // If current value is 0 then progress is down on 100%
  if (current === 0 || isNaN(current)) return -100;

  return Math.round(((current / previous) - 1) * 100);
}

export function summaryComparing (parameter, bucket, timeframe) {
  // Get a trend direction value
  const direction = arrowDirection(parameter, bucket);
  // Get percentage trend value
  const percentages = percentageValue(parameter, bucket);
  let trend;
  let text = '';

  // Case with No trend
  if (direction === 'no-trend') {
    if (timeframe === '12' || timeframe === '48') {
      text = TAPi18n.__('summaryComparing_displayTrendInfo_noTrend');
    } else {
      text = TAPi18n.__('summaryComparing_displayTrendInfo_noTrendDays', { day: timeframe });
    }

    return text;
  }

  // If trend is positive
  if (direction === 'arrow-up' || direction === 'arrow-up_time') {
    // Metric is better
    trend = TAPi18n.__('summaryComparing_trendDirection_higher');
  } else {
    // Otherwise metric is worse
    trend = TAPi18n.__('summaryComparing_trendDirection_lower');
  }

  const params = { percentage: percentages, direction: trend, day: timeframe };

  switch (timeframe) {
    // "today" is selected
    case '12': {
      text = TAPi18n.__('summaryComparing_displayTrendInfo_today', params);
      break;
    }
    // "yesterday" is selected
    case '48': {
      text = TAPi18n.__('summaryComparing_displayTrendInfo_yesterday', params);
      break;
    }
    // "Last N Days"
    default: {
      text = TAPi18n.__('summaryComparing_displayTrendInfo_days', params);
    }
  }

  // Don't display any text if there is no trend
  // Or display trend information
  return text;
}
