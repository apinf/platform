/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

export function arrowDirection (parameter, bucket) {
  let positiveTrend = 'arrow-up';
  let negativeTrend = 'arrow-down';
  let comparison;

  switch (parameter) {
    case 'requests':
      comparison = bucket.compareRequests;
      break;

    case 'time':
      comparison = bucket.compareResponse;
      positiveTrend = 'arrow-up_time';
      negativeTrend = 'arrow-down_time';
      break;

    case 'users':
      comparison = bucket.compareUsers;
      break;

    default:
      comparison = 0;

  }

  // If there is no trend
  if (comparison === 0) {
    // Don't display an arrow indicating
    return undefined;
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

export function calculateTrend (prev, curr) {
  // If values are equal
  // then no up-down
  if (prev === curr) return 0;

  // it is impossible to divide on 0
  // If previous value is 0 then progress is up on 100%
  if (prev === 0 || isNaN(prev)) return 100;

  // If current value is 0 then progress is down on 100%
  if (curr === 0 || isNaN(curr)) return -100;

  return Math.round(((curr / prev) - 1) * 100);
}

export function summaryComparing (parameter, bucket) {
  // Get a trend direction value
  const direction = arrowDirection(parameter, bucket);
  // Get percentage trend value
  const percentages = percentageValue(parameter, bucket);
  let trend;

  // Make sure trend exists
  if (direction && percentages) {
    // If trend is positive
    if (direction === 'arrow-up' || direction === 'arrow-down_time') {
      // Metric is better
      trend = 'higher';
    } else {
      // Otherwise metric is worse
      trend = 'lower';
    }

    return `${percentages} ${trend} than last 7 days`;
  }

  // Don't display any text if there is no trend
  return '';
}
