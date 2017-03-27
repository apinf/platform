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
export default function formatDate (date, dateFormat = 'LL') {
  // Get current language
  const language = TAPi18n.getLanguage();
  // Return formatted date
  return moment(date).locale(language).format(dateFormat);
}
