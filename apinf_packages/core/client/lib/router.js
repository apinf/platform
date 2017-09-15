/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

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

const redirectTocatalog = function () {
  FlowRouter.go('catalog');
};

const requireAdminRole = function () {
  Meteor.call('userIsAdmin', (error, result) => {
    if (!result) {
      // User is not authorized to access route
      FlowRouter.go('notAuthorized');
    }
  });
};

FlowRouter.triggers.enter([redirectTocatalog], { only: ['forgotPwd'] });

// Routes that require admin role
FlowRouter.triggers.enter(
  [requireAdminRole],
  { only: ['settings', 'branding', 'proxies', 'accountsAdmin'] });

export default signedIn;
