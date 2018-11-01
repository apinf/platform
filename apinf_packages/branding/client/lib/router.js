/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

signedIn.route('/settings/branding', {
  name: 'branding',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'branding' });
  },
});

FlowRouter.route('/privacy-policy', {
  name: 'privacyPolicy',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'privacyPolicy' });
  },
});

FlowRouter.route('/terms-of-use', {
  name: 'termsOfUse',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'termsOfUse' });
  },
});
