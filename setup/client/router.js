const additionalSetupRequired = function () {
    const userId = Meteor.userId();
    const userIsAdmin = Roles.userIsInRole(userId, "admin");
    // check if user is Admin - if yes, check if settings have been configured
    if (userIsAdmin) {
      Meteor.call('isInitialSetupComplete', function(error, setupComplete) {
        if (!setupComplete) {
          Router.go("setup");
        }
      });

    }
    this.next();
};

// check if setup is required before opening any page
Router.onBeforeAction(additionalSetupRequired, {except: []});
