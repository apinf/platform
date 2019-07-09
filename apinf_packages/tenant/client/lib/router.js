/* Copyright 2019 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor contributed packages imports
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// APInf imports
import signedIn from '/apinf_packages/core/client/lib/router';

signedIn.route('/tenants', {
  name: 'tenantCatalog',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'tenantCatalog' });
  },
});

signedIn.route('/tenants/auth', {
  name: 'authorizationForm',
  action () {
    BlazeLayout.render('masterLayout', { bar: 'navbar', main: 'authorizationForm' });
  },
});
