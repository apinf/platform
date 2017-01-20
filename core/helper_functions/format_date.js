import moment from 'moment';
import 'moment/min/locales.min';
/*
  Check file name for provided extensions
  @param {Date} date - Date object to be formatted
  @param {string} dateFormat - Date format, eg. "LL" (default) "MMMM D, YYYY" for "en", "Do MMMM[ta] YYYY" for "fi"
*/
export function formatDate (date, dateFormat = 'LL') {
  // Get current language
  const language = TAPi18n.getLanguage();
  // Return formatted date
  return moment(date).locale(language).format(dateFormat);
}
