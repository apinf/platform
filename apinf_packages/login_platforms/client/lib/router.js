/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

// Define route for loginPlatforms module
signedIn.route('/login-platforms', {
  name: 'login-platforms',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'loginPlatforms' });
  },
});
