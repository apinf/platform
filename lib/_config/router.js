var onAfterAction;

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

var requireAdminRole = function () {
  if (Meteor.user()) {
    // Get user ID
    var userId = Meteor.user()._id;

    var userIsAdmin = Roles.userIsInRole(userId, "admin");

    if (userIsAdmin) {
      // User is authorized to access route
      this.next();
    } else {
      // User is not authorized to access route
      this.redirect('notAuthorized');
    }
  } else {
    this.redirect('/sign-in');
    this.next();
  }
};

this.subs = new SubsManager();

Router.configure({
  layoutTemplate: "masterLayout",
  loadingTemplate: "loading",
  notFoundTemplate: "notFound",
  routeControllerNameConverter: "camelCase",
  onBeforeAction: function() {
    $('body').addClass('sidebar-mini');
    if (Meteor.userId() && !Meteor.user().username) {
      this.redirect('/profile');
    }
    this.next()
  }
});

Router.waitOn(function() {
  return subs.subscribe('user');
});

onAfterAction = function() {
  var $bd;
  window.scrollTo(0, 0);
  $bd = $('.modal-backdrop');
  $bd.removeClass('in');
  setTimeout(function() {
    $bd.remove();
  }, 300);
};

Router.onBeforeAction(requireAdminRole, {only: ['settings', 'branding']});

Router.onBeforeAction(redirectToSignIn, {
  except: ['home', 'atSignUp', 'forgotPwd', 'atSignOut', 'catalogue', 'viewApiBackend', 'search']
});

Router.onBeforeAction(redirectToDashboard, {only: ['forgotPwd', 'signOut']});

Router.onAfterAction(onAfterAction);
