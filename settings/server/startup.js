import { mailSettingsValid } from '/core/helper_functions/validate_settings';
import { Settings } from '../collection';

Meteor.startup(function () {
  // Call mail configuration update
  Meteor.call('updateMailConfiguration');
});
