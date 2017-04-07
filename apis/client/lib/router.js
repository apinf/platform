/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';

Tracker.autorun(() => {
  // The Roles package actually depends on a subscription.
  // If the subscription is not ready the Roles.userIsInRole method will always return false.
  // That is used for checking of does user have the admin role

  // Make sure the roles subscription is ready & FlowRouter hasn't initialized already
  if (Roles.subscription.ready() && !FlowRouter._initialized) {
    // Start routing
    return FlowRouter.initialize();
  }
  // Otherwise wait
  return FlowRouter.wait();
});

// Get current userId
const userId = Meteor.userId();
console.log(userId);
// Check that user is logged in
if (userId) {
    // Check if user is administrator
  const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
  console.log(userIsAdmin);
  if (!userIsAdmin) {
    // User is not authorized to access route
          console.log('hi');
        FlowRouter.go('notAuthorized');
  }    else {
        //FlowRouter.go('signIn');
        console.log('ELSE before router /apis/new CALL');
        FlowRouter.route('/apis/new', {
          name: 'addApi',
          action () {
            BlazeLayout.render('masterLayout', { main: 'addApi' });
          },
      }); //route(/api/new)
    }; //else
};

FlowRouter.route('/apis/import', {
  name: 'importApiConfiguration',
  action () {
    BlazeLayout.render('masterLayout', { main: 'importApiConfiguration' });
  },
});

FlowRouter.route('/apis/:slug/', {
  name: 'viewApi',
  action (params) {
    // Get current API Backend ID
    const slug = params.slug;

    // Check if API exists
    Meteor.call('apiExists', slug, (error, apiExists) => {
      // Check if API exists
      if (apiExists) {
        // Ensure current user has permissions to view backend
        Meteor.call('currentUserCanViewApi', slug, (canViewError, userCanViewApi) => {
          if (userCanViewApi) {
            BlazeLayout.render('masterLayout', { main: 'viewApi' });
          } else {
            // User is not allowed to view API
            FlowRouter.go('forbidden');
          }
        });
      } else {
        // If API doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});
