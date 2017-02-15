// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

// Define group for routes that require sign in
const signedIn = FlowRouter.group({
  triggersEnter: [function () {
    if (!(Meteor.loggingIn() || Meteor.userId())) {
      // Redirect to sign in
      FlowRouter.go('signIn');
    }
  }],
});

const requireAdminRole = function () {
  if (Meteor.user()) {
    // Get user ID
    const userId = Meteor.user()._id;

    const userIsAdmin = Roles.userIsInRole(userId, 'admin');

    if (!userIsAdmin) {
      // User is not authorized to access route
      FlowRouter.go('notAuthorized');
    }
  } else {
    FlowRouter.go('signIn');
  }
};

// Define 404 route
FlowRouter.notFound = {
  action () {
    BlazeLayout.render('masterLayout', { main: 'notFound' });
  },
};

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

const redirectToCatalogue = function () {
  FlowRouter.go('catalogue');
};

FlowRouter.triggers.enter([redirectToCatalogue], { only: ['forgotPwd'] });

// Routes that require admin role
FlowRouter.triggers.enter([requireAdminRole], { only: ['settings', 'branding', 'proxies'] });

export default signedIn;
