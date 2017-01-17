import moment from 'moment';
/*
  Check file name for provided extensions
  @param {Date} date - Date object to be formatted
  @param {string} dateFormat - Date format, eg. "LL" (default) "MMMM D, YYYY" for "en", "Do MMMM[ta] YYYY" for "fi"
*/
export function formatDate (date, dateFormat = 'LL') {
  // Return formatted date
  return moment(date).locale(TAPi18n.getLanguage()).format(dateFormat);
}
