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
// APINF imports
import signedIn from '/core/client/lib/router';
import Settings from '/settings/collection';

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

signedIn.route('/apis/new', {
  name: 'addApi',
   action () {
    const userId = Meteor.userId();
      // Check that user is logged in
      if (userId) {
       // Check if user is administrator
        const userIsAdmin = Roles.userIsInRole(userId, ['admin']);
        const settings = Settings.findOne();
        if (settings) {
          // Get access setting value
          // If access field doesn't exist, these is false. Allow users to add an API on default
          const onlyAdminsCanAddApis = settings.access ? settings.access.onlyAdminsCanAddApis : false;
         // Allow user to add an API because not only for admin
         console.log('setting value=',onlyAdminsCanAddApis);
          if (!userIsAdmin && !onlyAdminsCanAddApis) {
          // User is not authorized to access route
              FlowRouter.go('notAuthorized');
          }} else {
               BlazeLayout.render('masterLayout', { main: 'addApi' });
            }; //else
      }; //if userid
  }, //action
});

FlowRouter.route('/apis/import', {
  name: 'importApiConfiguration',
  action () {
    BlazeLayout.render('masterLayout', { main: 'importApiConfiguration' });
  },
});

FlowRouter.route('/apis/:_id/', {
  name: 'viewApi',
  action (params) {
    // Get current API Backend ID
    const apiId = params._id;

    // Check if API exists
    Meteor.call('checkIfApiExists', apiId, (error, apiExists) => {
      // Check if API exists
      if (apiExists) {
        // Ensure current user has permissions to view backend
        Meteor.call('currentUserCanViewApi', apiId, (canViewError, userIsAllowedToViewApi) => {
          if (userIsAllowedToViewApi) {
            FlowRouter.go('viewApi', { _id: apiId });
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
