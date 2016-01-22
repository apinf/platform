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

var ensureCanEditApiBackend = function () {
  if (Meteor.user()) {
    // Get API Backend ID
    var backendId = this.params._id

    // Get API Backend
    var apiBackend = ApiBackends.findOne(backendId);

    // Check if current User can edit the API Backend
    var userCanEdit = apiBackend.currentUserCanEdit();

    if (userCanEdit) {
      // User is authorized to edit
      this.next();
    } else {
      // User is not authorized to edit
      this.render('notAuthorized')
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

Router.onBeforeAction(redirectToSignIn, {
  except: ['home', 'atSignUp', 'forgotPwd', 'atSignOut', 'catalogue', 'viewApiBackend', 'search']
});

Router.onBeforeAction(redirectToDashboard, {only: ['home', 'forgotPwd', 'signOut']});

Router.onBeforeAction(ensureCanEditApiBackend, {only: ['editApiBackend']});

Router.onAfterAction(onAfterAction);
