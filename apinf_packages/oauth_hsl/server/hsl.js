/* Copyright 2018 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Accounts } from 'meteor/accounts-base';

Accounts.oauth.registerService('hsl');

Accounts.addAutopublishFields({
  // not sure whether the OIDC api can be used from the browser,
  // thus not sure if we should be sending access tokens; but we do it
  // for all other oauth2 providers, and it may come in handy.
  forLoggedInUser: ['services.hsl'],
  forOtherUsers: ['services.hsl.id']
});
