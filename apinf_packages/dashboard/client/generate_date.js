/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */


/**
 * Generate date range with specified parameters
 * @param {Object} params - Parameters for date range
 * @param {*} params.startDate - start date of range (included value)
 * @param {*} params.startDate - end date of range (included value)
 * @param {string} params.format - date format
 * @param {number} params.step - step of interval
 */
export function generateDate (params) {
  const { startDate, endDate, step, format } = params;
  // Placeholders for date
  const dateList = [];
  // Include endDate
  while (startDate <= endDate) {
    dateList.push(startDate.format(format));
    startDate.add(step, 'days');
  }
  return dateList;
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
