/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { Accounts } from 'meteor/accounts-base';
import { AccountsTemplates } from 'meteor/useraccounts:core';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';
import { TAPi18n } from 'meteor/tap:i18n';
import { sAlert } from 'meteor/juliancwirko:s-alert';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

FlowRouter.route('/users', {
  name: 'accountsAdmin',
  triggersEnter: [
    function (context, redirect) {
      /*
      Make sure user is authorized to access route (admin users only)
      */

      // Get current User ID
      const userId = Meteor.userId();

      // Check if User is admin
      const userIsAdmin = Roles.userIsInRole(userId, 'admin');

      // If user is not an admin
      if (!userIsAdmin) {
        // Redirect to 'not authorized' route
        redirect('/not-authorized');
      }
    },
  ],
  action () {
    BlazeLayout.render('masterLayout', { main: 'accountsAdmin' });
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
        sAlert.error(error.reason);
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
    BlazeLayout.render('masterLayout', { main: 'account' });
  },
});

// Add route to signedIn group, requires user to sign in
signedIn.route('/settings/profile', {
  name: 'profile',
  action () {
    BlazeLayout.render('masterLayout', { main: 'profile' });
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
