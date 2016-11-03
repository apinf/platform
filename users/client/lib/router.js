import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import { sAlert } from 'meteor/juliancwirko:s-alert';
import { TAPi18n } from 'meteor/tap:i18n';
import { Tracker } from 'meteor/tracker';

Router.route('/users', {
  name: 'accountsAdmin',
  layout: 'masterLayout',
  template: 'accountsAdmin',
});

Router.route('/verify-email/:token', {
  name: 'verify-email',
  action () {
    // Get token from Router params
    const token = Router.current().params.token;
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
    Router.go('/');
  },
});

Router.route('/settings/account', {
  name: 'account',
  layout: 'masterLayout',
  template: 'account',
});

Router.route('/settings/profile', {
  name: 'profile',
  layout: 'masterLayout',
  template: 'profile',
});

// Redirect to profile page if user doesn't have username
// Eg. logged in with Github & username already taken
const checkUsername = function () {
  // Workaround for https://github.com/iron-meteor/iron-router/issues/1031
  if (Tracker.currentComputation.firstRun) {
    // Get logged in user
    const loggedInUser = Meteor.user();
    // If user exists but does not have username defined
    if (loggedInUser && !loggedInUser.username) {
      // redirect to profile
      this.redirect('profile');
      // Get username 'update needed' message
      const message = TAPi18n.__('profile_setUsername');
      // Inform user to define username
      sAlert.info(message, { onRouteClose: false });
    }
    this.next();
  }
};
// Don't redirect on profile page
Router.onBeforeAction(checkUsername, { except: ['profile'] });

Router.route('/sign-out', {
  name: 'signOut',
  layout: 'masterLayout',
  template: 'signOut',
});

const signOut = function () {
  Meteor.logout();
  this.redirect('/');
  this.next();
};

Router.onBeforeAction(signOut, { only: ['signOut'] });
