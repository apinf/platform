/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Roles } from 'meteor/alanning:roles';

const additionalSetupRequired = function () {
  if (Meteor.user()) {
    // Get user ID
    const userId = Meteor.userId();

    const userIsAdmin = Roles.userIsInRole(userId, 'admin');

    if (userIsAdmin) {
      Meteor.call('isInitialSetupComplete', (error, setupComplete) => {
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

// This is used for scroll page to top while change the route.
const scrollToTop = () => {
  return $(this).scrollTop(0);
};
FlowRouter.triggers.enter([scrollToTop]);
