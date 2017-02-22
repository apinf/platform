import moment from 'moment';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';
import 'moment/min/locales.min';

// Calculate time passed from create
Template.registerHelper('calculateFromDate', (date) => {
  // Get current language
  const language = TAPi18n.getLanguage();
  // return moment(date).format('YYYY-MM-DD HH:mm');
  return moment(date).locale(language).from(moment());
});
