/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import 'locale-compare-polyfill';

// Meteor packages imports
import { TAPi18n } from 'meteor/tap:i18n';

/*
  Sort function with i18n support
  @param {string} string1 - string format
  @param {string} string2 - string format
  @param {string} sort - string format
*/

// use custom sort function with i18n support
export default function localisedSorting (string1, string2, sort = 1) {
  // Get current language
  const language = TAPi18n.getLanguage();
  
  return string1.localeCompare(string2, language) * sort;  
}
