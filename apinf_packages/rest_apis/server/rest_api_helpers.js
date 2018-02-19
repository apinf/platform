/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Npm packages imports
import moment from 'moment';

 // Fill and return error response message body
 export function errorMessagePayload (statusCode, messageText, additionalKey, additionalValue) {
   // Fill payload
   const errorPayload = {
     statusCode,
     body: {
       status: 'fail',
       message: messageText,
     },
   };
   // When an additional information is needed to be included in response
   if (additionalKey) {
     errorPayload.body[additionalKey] = additionalValue;
   }
   return errorPayload;
 }

 export function searchBeginEndDates (rawDate) {
  // Search dates, beginning and end
  const searchDates = {
    begin: '',
    end: '',
  }
  let fromDate;
  let toDate;

  if (rawDate.period === 'today') {
    // only one day
    fromDate = moment();
    fromDate_x = fromDate.format('x');
    fromDate_f = fromDate.format('MM-DD-YYYY');
    toDate = fromDate;
    toDate_x = toDate.format('x');
    toDate_f = toDate.format('MM-DD-YYYY');
  } else if (rawDate.period === 'week') {
    // previous week, ending yesterday
    fromDate = moment().subtract(1, 'weeks');
    fromDate_x = fromDate.format('x');
    fromDate_f = fromDate.format('MM-DD-YYYY');
    toDate = moment().subtract(1, 'days');
    toDate_x = toDate.format('x');
    toDate_f = toDate.format('MM-DD-YYYY');
  } else if (rawDate.period === 'month') {
    // previous month, ending yesterday
    fromDate = moment().subtract(1, 'months');
    fromDate_x = fromDate.format('x');
    fromDate_f = fromDate.format('MM-DD-YYYY');
    toDate = moment().subtract(1, 'days');
    toDate_x = toDate.format('x');
    toDate_f = toDate.format('MM-DD-YYYY');
  } else {
    // free value, starting from given, duration of days
    fromDate = moment(rawDate.startDate);
    fromDate_x = fromDate.format('x');
    fromDate_f = fromDate.format('MM-DD-YYYY');
    toDate = moment(rawDate.startDate).add(days - 1, 'days');
    toDate_x = toDate.format('x');
    toDate_f = toDate.format('MM-DD-YYYY');
  }
  console.log('fromDate=', fromDate);
  console.log('fromDate_f=', fromDate_f);
  console.log('fromDate_x=', fromDate_x);
  console.log('toDate=', toDate);
  console.log('toDate_f=', toDate_f);
  console.log('toDate_x=', toDate_x);
  // To date

  searchDates.begin = fromDate_f;
  searchDates.end = toDate_f;

  console.log('helper searchDates=', searchDates);

  return searchDates;
}
