/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';

// APInf imports
import loginAttemptVerifier from './login_verify';

Meteor.startup(() => {
  // In case of server restart, we need to set MAIL_URL
  Meteor.call('configureSmtpSettings');
  // Toggle attach login attempt verifier function to account login
  Accounts.validateLoginAttempt(loginAttemptVerifier);
});
