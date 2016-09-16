import { Settings } from '/settings/collection';
import { mailSettingsValid, loginAttemptVerifier } from '/core/helper_functions/validate_settings';

Meteor.startup(function() {
  // Get settings
  const settings = Settings.findOne();

  // Toggle loginAttemptVerifier ON when Mail settings exist to allow first user
  if( mailSettingsValid(settings) ) {
    Accounts.validateLoginAttempt(loginAttemptVerifier);
  }
});
