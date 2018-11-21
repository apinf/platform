/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

signedIn.route('/users', {
  name: 'accountsAdmin',
  action () {
    BlazeLayout.render('adminLayout', { bar: 'navbar', main: 'accountsAdmin' });
  },
});

FlowRouter.route('/verify-email/:token', {
  name: 'verify-email',
  action (params) {
    // Get token from Router params
    const token = params.token;
    Accounts.verifyEmail(token, (error) => {
      if (error) {
        // Eg. token invalid or already used
        sAlert.error(error.reason, { timeout: 'none' });
      } else {
        // Email successfully verified
        sAlert.success(TAPi18n.__('emailVerification_successMessage'));
      }
    });
    // Go to front page
    FlowRouter.go('/');
  },
});

// Add route to signedIn group, requires user to sign in
signedIn.route('/settings/account', {
  name: 'account',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'account' });
  },
});

// Add route to signedIn group, requires user to sign in
signedIn.route('/settings/profile', {
  name: 'profile',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'profile' });
  },
});

FlowRouter.route('/sign-out', {
  name: 'signOut',
  triggersEnter: [
    function () {
      // Sign-out user; returns to front page by default
      AccountsTemplates.logout();
    },
  ],
});
