/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

FlowRouter.route('/sign-in', {
  name: 'signIn',
  action () {
    BlazeLayout.render('masterLayout', { main: 'signIn' });
  },
});


FlowRouter.route('/verfication', {
  name: 'verfication',
  action () {
    BlazeLayout.render('masterLayout', { main: 'verfication' });
  },
});

FlowRouter.route('/reset-password', {
  name: 'resetPassword',
  action () {
    BlazeLayout.render('masterLayout', { main: 'resetPassword' });
  },
});
