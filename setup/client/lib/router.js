import { FlowRouter } from 'meteor/kadira:flow-router';

const additionalSetupRequired = function () {
  if (Meteor.user()) {
    // Get user ID
    const userId = Meteor.user()._id;

    const userIsAdmin = Roles.userIsInRole(userId, 'admin');

    if (userIsAdmin) {
      Meteor.call('isInitialSetupComplete', function (error, setupComplete) {
        if (!setupComplete) {
          // Show the setup needed modal
          Modal.show('setupNeededModal');
        }
      });
    }
  }
};

// check if setup is required before opening any page
FlowRouter.triggers.enter([additionalSetupRequired], { except: ['settings', 'branding'] });
