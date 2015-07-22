var onAfterAction;

var redirectToSignIn = function () {
  if (Meteor.user()) {
    this.next();
  } else {
    this.render('atSignIn');
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
    if (Config.username && Meteor.userId() && !Meteor.user().username) {
      this.redirect('/setUserName');
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

Router.onAfterAction(onAfterAction);

Router.plugin('ensureSignedIn', {
  except: ['home', 'atSignIn', 'atSignUp', 'atForgotPassword', 'atSignOut']
});
