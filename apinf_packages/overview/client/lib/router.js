/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/overview', {
  name: 'overview',
  action () {
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
