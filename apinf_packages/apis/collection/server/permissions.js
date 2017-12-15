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
import Apis from '../';

Apis.allow({
  insert (userId) {
    if (userId) {
      // Get settings document
      const settings = Settings.findOne();

      // Get access setting value
      const onlyAdminsCanAddApis = _.get(settings, 'access.onlyAdminsCanAddApis');

      // Check if access settings is set
      if (onlyAdminsCanAddApis) {
        // If a user is admin then the user can add an API
        return Roles.userIsInRole(userId, ['admin']);
      }

      // Otherwise any registered user can add an API
      return true;
    }

    // Anonymous user doesn't have permission to add an API
    return false;
  },
  update (userId, apiBackendDoc) {
    // Get API with ID
    const api = Apis.findOne(apiBackendDoc._id);
    // If a user can manage api then the user can edit that
    return api && api.currentUserCanManage();
  },
  remove (userId, apiBackendDoc) {
    // Get API with ID
    const api = Apis.findOne(apiBackendDoc._id);
    // If a user can manage api then the user can remove that
    return api && api.currentUserCanManage();
  },
});

Apis.deny({
  insert (fields) {
    // Don't allow user to set average rating or bookmark count fields
    if (_.hasIn(fields, 'averageRating') || _.hasIn(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
  update (fields) {
    // Don't allow user to set average rating or bookmark count fields
    if (_.hasIn(fields, 'averageRating') || _.hasIn(fields, 'bookmarkCount')) {
      return true;
    }
    return false;
  },
});
