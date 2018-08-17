/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

// Add route to signedIn group, requires user to sign in
signedIn.route('/overview', {
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

    if (!context.queryParams.sort) {
      // Initialize sort parameter if it doesn't specify
      // Default value is 'name'
      context.queryParams.sort = 'name';
    }
  }],
  name: 'overview',
  action: () => {
    BlazeLayout.render('masterLayout', { main: 'overview' });
  },
});

FlowRouter.route('/overview/plan', {
  name: 'plan',
  action () {
    BlazeLayout.render('masterLayout', { main: 'plan' });
  },
});

FlowRouter.route('/plans', {
  name: 'plans',
  action () {
    BlazeLayout.render('masterLayout', { main: 'plans' });
  },
});
