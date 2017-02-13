import moment from 'moment';
import { Template } from 'meteor/templating';

// Calculate time passed from create
Template.registerHelper('calculateFromDate', function(date) {
  // return moment(date).format('YYYY-MM-DD HH:mm');
  return moment(date).from(moment());
});
