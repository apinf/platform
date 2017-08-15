/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

import { Roles } from 'meteor/alanning:roles';

import ApiLogo from '../';

ApiLogo.allow({
  insert (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  remove (userId) {
    return Roles.userIsInRole(userId, ['admin', 'manager']);
  },
  read () {
    return true;
  },
  write () {
    return true;
  },
});
