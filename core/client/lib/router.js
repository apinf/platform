/*
Router.configure({
  layoutTemplate: 'masterLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  routeControllerNameConverter: 'camelCase',
});

Router.waitOn(function() {
  return this.subscribe('user');
});

var redirectToDashboard = function () {
  if (Meteor.user()) {
    this.redirect('/dashboard');
  }
  this.next();
};

Router.onBeforeAction(redirectToDashboard, {only: ['forgotPwd', 'signOut']});

// Routes for logged in user
Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});

Router.map(function() {
  this.route('notAuthorized', {
    path: '/not-authorized',
    layoutTemplate: 'masterLayout',
    render: 'notAuthorized',
  });

  this.route('forbidden', {
    path: '/forbidden',
    layoutTemplate: 'masterLayout',
    render: 'forbidden',
  });
});
*/