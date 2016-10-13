import { Settings } from '/settings/collection';
import { mailSettingsValid } from '/core/helper_functions/validate_settings';
import { loginAttemptVerifier } from './login_verify';

Meteor.startup(function() {
  // Get settings
  const settings = Settings.findOne();

  // Toggle loginAttemptVerifier ON when Mail settings exist to allow first user
  if( mailSettingsValid(settings) ) {
    Accounts.validateLoginAttempt(loginAttemptVerifier);
  }
});
