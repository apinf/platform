import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Accounts } from 'meteor/accounts-base';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { AccountsTemplates } from 'meteor/useraccounts:core';

FlowRouter.route('/users', {
  name: 'accountsAdmin',
  action: function () {
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

FlowRouter.route('/settings/account', {
  name: 'account',
  action: function () {
    BlazeLayout.render('masterLayout', { main: 'account' });
  },
});

FlowRouter.route('/settings/profile', {
  name: 'profile',
  action: function () {
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
