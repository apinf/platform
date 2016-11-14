import moment from 'moment';
/*
  Check file name for provided extensions
  @param {Date} date - Date object to be formatted
  @param {string} dateFormat - Date format, eg. "MMMM DD YYYY" (default)
*/
export function formatDate (date, dateFormat = 'MMMM DD YYYY') {
  // Return formatted date
  return moment(date).format(dateFormat);
}
