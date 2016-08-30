Router.map(function() {
  this.route("accountsAdmin", {
    path: "/users",
    layoutTemplate: "masterLayout",
    render: "accountsAdmin"
  });
  this.route('/settings/account', {
    name: 'settings.account',
    layout: 'masterLayout',
    template: 'account'
  });
  this.route('/settings/profile', {
    name: 'settings.profile',
    layout: 'masterLayout',
    template: 'profile'
  });
  this.route('signOut', {
    path: '/sign-out',
    onBeforeAction: function() {
      Meteor.logout(function() {});
      this.redirect('/');
      return this.next();
    }
  });
});
