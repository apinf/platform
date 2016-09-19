Router.route('/users', {
  name: 'accountsAdmin',
  layout: 'masterLayout',
  template: 'accountsAdmin',
});

Router.route('/verify-email/:token',{
  name: 'verify-email',
  action: function() {
    // Get token from Router params
    const token = Router.current().params.token;
    Accounts.verifyEmail( token, ( error ) => {
      if( error ) {
        // Eg. token invalid or already used
        sAlert.error( error.reason );
      } else {
        // Email successfully verified
        sAlert.success(TAPi18n.__('emailVerification_successMessage'));
      }
    });
    // Go to front page
    Router.go( '/' );
  }
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

Router.route('/sign-out', {
  name: 'signOut',
  layout: 'masterLayout',
  template: 'signOut',
});

const signOut = function () {
  Meteor.logout(function () {});
  this.redirect('/');
  return this.next();
};

Router.onBeforeAction(signOut, { only: ['signOut'] });
