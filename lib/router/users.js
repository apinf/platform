Router.route('signOut', {
  path: '/sign-out',
  onBeforeAction: function() {
    Meteor.logout(function() {});
    this.redirect('/');
    return this.next();
  }
});
