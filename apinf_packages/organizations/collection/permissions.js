/* Copyright 2017 Apinf Oy
This file is covered by the EUPL license.
You may obtain a copy of the licence at
https://joinup.ec.europa.eu/community/eupl/og_page/european-union-public-licence-eupl-v11 */

// Meteor packages imports
import { Roles } from 'meteor/alanning:roles';

// Npm packages imports
import _ from 'lodash';

// Collection imports
import Settings from '/apinf_packages/settings/collection';
import Organizations from './';

Organizations.allow({
  insert (userId) {
    // Get settigns document
    const settings = Settings.findOne();

    if (settings) {
      // Get value of field or false as default value
      const onlyAdminsCanInsert = _.get(settings, 'access.onlyAdminsCanAddOrganizations', false);

      // Allow user to add an Organization because not only for admin
      if (!onlyAdminsCanInsert) {
        return true;
      }

      // Otherwise check if current user is admin
      return Roles.userIsInRole(userId, ['admin']);
    }

    // Return true because no settings are set
    // By default allowing all user to add an Organization
    return true;
  },
  update (userId, organization) {
    // Check if current user can update
    return organization.currentUserCanManage();
  },
  remove (userId, organization) {
    // Check if current user can remove
    return organization.currentUserCanManage();
  },
});
