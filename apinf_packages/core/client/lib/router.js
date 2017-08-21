/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

FlowRouter.wait();

Tracker.autorun(() => {
  // The Roles package actually depends on a subscription.
  // If the subscription is not ready the Roles.userIsInRole method will always return false.
  // That is used for checking of does user have the admin role

  // Make sure the roles subscription is ready & FlowRouter hasn't initialized already
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    // Start routing
    return FlowRouter.initialize();
  }
  // Otherwise nothing
  return undefined;
});

// Define group for routes that require sign in
const signedIn = FlowRouter.group({
  triggersEnter: [function () {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
      // Redirect to sign in
      FlowRouter.go('signIn');
    }
  }],
});

// Define 401 route
FlowRouter.route('/not-authorized', {
  name: 'notAuthorized',
  action () {
    BlazeLayout.render('masterLayout', { main: 'notAuthorized' });
  },
});

// Define 403 route
FlowRouter.route('/forbidden', {
  name: 'forbidden',
  action () {
    BlazeLayout.render('masterLayout', { main: 'forbidden' });
  },
});

// Define 404 route
FlowRouter.notFound = {
  action () {
    BlazeLayout.render('masterLayout', { main: 'notFound' });
  },
};

const redirectToCatalogue = function () {
  FlowRouter.go('catalogue');
};

const requireAdminRole = function () {
  // Get user ID
  const userId = Meteor.userId();

  if (userId) {
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    if (!userIsAdmin) {
      // User is not authorized to access route
      FlowRouter.go('notAuthorized');
    }
  } else {
    FlowRouter.go('signIn');
  }
};

FlowRouter.triggers.enter([redirectToCatalogue], { only: ['forgotPwd'] });

// Routes that require admin role
FlowRouter.triggers.enter([requireAdminRole], { only: ['settings', 'branding', 'proxies'] });

export default signedIn;
