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

var redirectToSignIn = function () {
  if (Meteor.user()) {
    this.next();
  } else {
    this.redirect('/sign-in');
    this.next();
  }
};

var redirectToDashboard = function () {
  if (Meteor.user()) {
    this.redirect('/dashboard');
    this.next();
  } else {
    this.next();
  }
};

// Router.onBeforeAction(redirectToSignIn, {
//   except: ['home', 'atSignUp', 'forgotPwd', 'atSignOut', 'catalogue', 'viewApi', 'search']
// });

Router.onBeforeAction(redirectToDashboard, {only: ['forgotPwd', 'signOut']});

Router.map(function() {
  this.route("notAuthorized", {
    path: "/not-authorized",
    layoutTemplate: "masterLayout",
    render: "notAuthorized"
  });
  this.route("forbidden", {
    path: "/forbidden",
    layoutTemplate: "masterLayout",
    render: "forbidden"
  });
});
