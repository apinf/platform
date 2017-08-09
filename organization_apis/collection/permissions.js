/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Collection imports
import OrganizationApis from './';

OrganizationApis.allow({
  insert (userId) {
    // Check if current user is admin
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    // Only admin can insert
    if (userIsAdmin) {
      return true;
    }

    return false;
  },
  remove (userId, organizationApi) {
    // Check if current user can remove
    return organizationApi.organization().currentUserCanManage();
  },
});
