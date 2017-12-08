/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import moment from 'moment';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import 'moment/min/locales.min';

// Calculate time passed from create
Template.registerHelper('dateInTimeAgoFormat', (date) => {
  // Get current language
  const language = TAPi18n.getLanguage();
  // return calculated difference from creation date
  return moment(date).locale(language).from(moment());
});

Template.registerHelper('localeFormatDate', (date) => {
  // Get current language
  const language = TAPi18n.getLanguage();

  return new Date(date).toLocaleDateString(language);
});
