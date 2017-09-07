/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Meteor } from 'meteor/meteor';

// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

// Add route to signedIn group, requires user to sign in
signedIn.route('/dashboard', {
  // Get the empty query parameters on Enter
  triggersEnter: [(context) => {
    // Initialize the query parameters which can be calculated in code
    // Do it to saving url consistent for the browser history
    if (!context.queryParams.proxy_id) {
      // Initialize proxy parameter if it doesn't specify
      context.queryParams.proxy_id = null;
    }

    if (!context.queryParams.timeframe) {
      // Initialize timeframe parameter if it doesn't specify
      // Default value is 7
      context.queryParams.timeframe = 7;
    }
  }],
  name: 'dashboard',
  action () {
    BlazeLayout.render('masterLayout', { main: 'dashboardPage' });
  },
});

signedIn.route('/analytic/:proxyBackendId', {
  // Get the empty query parameters on Enter
  triggersEnter: [(context) => {
    if (!context.queryParams.timeframe) {
      // Initialize timeframe parameter if it doesn't specify
      // Default value is 7
      context.queryParams.timeframe = 7;
    }
  }],
  name: 'apiAnalyticPage',
  action (params) {
    const proxyBackendId = params.proxyBackendId;

    // Make sure proxy Backend exists with this ID
    Meteor.call('proxyBackendExists', proxyBackendId, (error, proxyBackend) => {
      if (proxyBackend) {
        // Make sure a user has permission to view Analytic page
        Meteor.call('userCanViewAnalytic', proxyBackend.apiId, (viewError, canView) => {
          if (canView) {
            BlazeLayout.render('masterLayout', { main: 'apiAnalyticPage' });
          } else {
            // User don't have permission
            FlowRouter.go('forbidden');
          }
        });
      } else {
        // If Proxy Backend doesn't exist, show 'Not Found'
        FlowRouter.go('notFound');
      }
    });
  },
});
