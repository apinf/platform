/* Copyright 2017 Apinf Oy
 This file is covered by the EUPL license.
 You may obtain a copy of the licence at
 https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// Npm packages imports
import Raven from 'raven-js';

// Set Global Error Handler
window.addEventListener('error', (e) => {
  // Send error message and stack
  Raven.captureException(e.message, { extra: { stack: e.error.stack } });
});

// Set Global Error Handler on Promise rejection
window.addEventListener('unhandledrejection', (e) => {
  // Send error message and stack
  Raven.captureException(e.reason.message, { extra: { stack: e.reason.stack } });
});

// Set Global Handler on Sign in
Accounts.onLogin(() => {
  Raven.setUserContext({
    email: Meteor.user().emails[0].address,
    id: Meteor.userId(),
  });
});

// Set Global Handler on Sign Out
Accounts.onLogout(() => {
  Raven.setUserContext();
});
