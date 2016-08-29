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
//   except: ['home', 'atSignUp', 'forgotPwd', 'atSignOut', 'catalogue', 'viewApiBackend', 'search']
// });

Router.onBeforeAction(redirectToDashboard, {only: ['forgotPwd', 'signOut']});

Router.map(function() {

  this.route("settingsWizard", {
    path: "/settingsWizard",
    layoutTemplate: "homeLayout",
    render: "settingsWizard"
  });

  this.route("home", {
    path: "/",
    layoutTemplate: "homeLayout"
  });

  this.route('search', {
    path: "/search",
    layout: "masterLayout"
  });

  this.route("apiDocumentationEditor", {
    path: "/documentation/editor",
    layoutTemplate: "masterLayout"
  });

  this.route("statusCheck", {
    path: "/status",
    layoutTemplate: "masterLayout",
    render: "statusCheck"
  });

  this.route("accountsAdmin", {
    path: "/users",
    layoutTemplate: "masterLayout",
    render: "accountsAdmin"
  });

  this.route("notAuthorized", {
    path: "/not-authorized",
    layoutTemplate: "masterLayout",
    render: "notAuthorized"
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
