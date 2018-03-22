/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { TAPi18n } from 'meteor/tap:i18n';

// Npm packages imports
import moment from 'moment';
import 'moment/min/locales.min';

/*
  Check file name for provided extensions
  @param {Date} date - Date object to be formatted
  @param {string} dateFormat - Date format, eg. "LL" (default)
    "MMMM D, YYYY" for "en", "Do MMMM[ta] YYYY" for "fi"
*/
export function formatDate (date, dateFormat = 'LL') {
  // Get current language
  const language = TAPi18n.getLanguage();
  // Return formatted date
  return moment(date).locale(language).format(dateFormat);
}

export function getLocaleDateFormat () {
  // Use regex to define Finnish locale for different browsers
  const regex = RegExp('fi*');

  // Get locale
  const locale = navigator.languages ? navigator.languages[0] :
    (navigator.language || navigator.userLanguage);

  moment.locale(locale);

  // Get locale data
  const localeData = moment.localeData();

  let format = localeData.longDateFormat('L');

  if (regex.test(locale)) {
    // Remove year part (save the last dot)
    format = format.replace(/YYYY/, '');
  } else {
    // Remove year part
    format = format.replace(/.YYYY/, '');
  }

  return format;
}
