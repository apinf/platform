/* Copyright 2017 Apinf Oy
  This file is covered by the EUPL license.
  You may obtain a copy of the licence at
  https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

signedIn.route('/mqtt', {
  name: 'mqtt',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'mqttDashboardNavbar', main: 'mqttDashboardPage' });
  },
});

signedIn.route('/topics', {
  name: 'topics',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'mqttDashboardNavbar', main: 'topicsPage' });
  },
});

signedIn.route('/topics/:id', {
  name: 'topicPage',
  action (params) {
    Meteor.call('topicExists', params.id, (error, result) => {
      if (result) {
        BlazeLayout.render('masterLayout', { bar: 'mqttDashboardNavbar', main: 'topicPage' });
      } else {
        // Show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});

signedIn.route('/acl', {
  name: 'acl',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'mqttDashboardNavbar', main: 'aclPage' });
  },
});

const requireAdminRole = function () {
  Meteor.call('userIsAdmin', (error, result) => {
    if (!result) {
      // User is not authorized to access route
      FlowRouter.go('notAuthorized');
    }
  });
};

// Routes that require admin role
FlowRouter.triggers.enter(
  [requireAdminRole],
  { only: ['acl', 'topicPage', 'topics', 'mqtt'] });
