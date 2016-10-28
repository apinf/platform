Router.configure({
  layoutTemplate: "masterLayout",
  loadingTemplate: "loading",
  notFoundTemplate: "notFound",
  routeControllerNameConverter: "camelCase",
  onBeforeAction: function() {
    if (Meteor.userId() && !Meteor.user().username) {
      this.redirect('/profile');
    }
    this.next();
  }
});

Router.waitOn(function() {
  return this.subscribe('user');
});

var redirectToDashboard = function () {
  if (Meteor.user()) {
    this.redirect('/dashboard');
    this.next();
  } else {
    this.next();
  }
};

// Routes for logged in user
Router.plugin('ensureSignedIn', {
  only: ['dashboard']
});

Router.onBeforeAction(redirectToDashboard, {only: ['forgotPwd', 'signOut']});

Router.map(function() {
  this.route("notAuthorized", {
    path: "/not-authorized",
    layoutTemplate: "masterLayout",
    render: "notAuthorized"
  });

  this.route('notFound', {
    path: '/not-found',
    layoutTemplate: 'masterLayout',
    render: 'notFound',
  });

  this.route("forbidden", {
    path: "/forbidden",
    layoutTemplate: "masterLayout",
    render: "forbidden"
  });
});
