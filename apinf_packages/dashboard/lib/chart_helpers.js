/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

/**
 * Generate date range with specified parameters
 * @param {Object} params - Parameters for date range
 * @param {*} params.startAt - start date of range (included value)
 * @param {*} params.endAt - end date of range (exclude value)
 * @param {string} params.format - date format
 * @param {string} params.interval - type of interval (days, hours, minutes)
 */
export function generateDate (params) {
  const { startAt, endAt, format, interval } = params;
  // Placeholders for date
  const labels = [];
  // Include endDate
  while (startAt < endAt) {
    labels.push(startAt.format(format));
    startAt.add(1, interval);
  }
  return labels;
}

/**
 * Generate an array with "0" values with specified length
 * @param {number} length - length of an array
 */
export function arrayWithZeros (length) {
  const arr = [];
  // Generate an array with "0" values
  for (let i = 0; i < length; i++) {
    arr.push(0);
  }

  return arr;
}
