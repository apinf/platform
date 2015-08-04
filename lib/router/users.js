Router.map(function() {
  this.route("profile", {
    path: "/profile"
  });
  this.route("account", {
    path: "/account"
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
