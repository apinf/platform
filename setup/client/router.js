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

const additionalSetupRequired = function () {
  if (Meteor.user()) {
    // Get user ID
    var userId = Meteor.user()._id;

    var userIsAdmin = Roles.userIsInRole(userId, "admin");

    if (userIsAdmin) {
      Meteor.call('isInitialSetupComplete', function(error, setupComplete) {

        if (!setupComplete) {
          // Show the setup needed modal
          Modal.show('setupNeededModal');
        }
      });
    }
  }

  this.next();
};

// check if setup is required before opening any page
Router.onBeforeAction(additionalSetupRequired, {except: ['settings', 'branding']});

Router.onBeforeAction(requireAdminRole, {only: ['settings', 'branding']});
